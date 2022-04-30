#!/usr/bin/env python3

import argparse
import collections
import os
import sys
import time
from distutils.version import StrictVersion
from io import StringIO

import json

import openstack as sdk
from openstack.cloud import inventory as sdk_inventory
from openstack.config import loader as cloud_config

CONFIG_FILES = ['/etc/ansible/openstack.yaml', '/etc/ansible/openstack.yml']


def get_groups_from_server(server_vars, namegroup=True):
    groups = []

    region = server_vars['region']
    cloud = server_vars['cloud']
    metadata = server_vars.get('metadata', {})

    # Create a group for the cloud
    groups.append(cloud)

    # Create a group on region
    if region:
        groups.append(region)

    # And one by cloud_region
    groups.append("%s_%s" % (cloud, region))

    # Check if group metadata key in servers' metadata
    if 'group' in metadata:
        groups.append(metadata['group'])

    for extra_group in metadata.get('groups', '').split(','):
        if extra_group:
            groups.append(extra_group.strip())

    groups.append('instance-%s' % server_vars['id'])
    if namegroup:
        groups.append(server_vars['name'])

    for key in ('flavor', 'image'):
        if 'name' in server_vars[key]:
            groups.append('%s-%s' % (key, server_vars[key]['name']))

    for key, value in iter(metadata.items()):
        groups.append('meta-%s_%s' % (key, value))

    az = server_vars.get('az', None)
    if az:
        # Make groups for az, region_az and cloud_region_az
        groups.append(az)
        groups.append('%s_%s' % (region, az))
        groups.append('%s_%s_%s' % (cloud, region, az))
    return groups


def get_host_groups(inventory, refresh=False, cloud=None):
    (cache_file, cache_expiration_time) = get_cache_settings(cloud)
    if is_cache_stale(cache_file, cache_expiration_time, refresh=refresh):
        groups = to_json(get_host_groups_from_cloud(inventory))
        with open(cache_file, 'w') as f:
            f.write(groups)
    else:
        with open(cache_file, 'r') as f:
            groups = f.read()
    return groups


def append_hostvars(hostvars, groups, key, server, namegroup=False):
    hostvars[key] = dict(
        ansible_ssh_host=server['interface_ip'],
        ansible_host=server['interface_ip'],
        openstack=server)

    metadata = server.get('metadata', {})
    if 'ansible_user' in metadata:
        hostvars[key]['ansible_user'] = metadata['ansible_user']

    for group in get_groups_from_server(server, namegroup=namegroup):
        groups[group].append(key)


def get_host_groups_from_cloud(inventory):
    groups = collections.defaultdict(list)
    firstpass = collections.defaultdict(list)
    hostvars = {}
    list_args = {}
    if hasattr(inventory, 'extra_config'):
        use_hostnames = inventory.extra_config['use_hostnames']
        list_args['expand'] = inventory.extra_config['expand_hostvars']
        if StrictVersion(sdk.version.__version__) >= StrictVersion("0.13.0"):
            list_args['fail_on_cloud_config'] = \
                inventory.extra_config['fail_on_errors']
    else:
        use_hostnames = False

    for server in inventory.list_hosts(**list_args):

        if 'interface_ip' not in server:
            continue
        firstpass[server['name']].append(server)
    for name, servers in firstpass.items():
        if len(servers) == 1 and use_hostnames:
            append_hostvars(hostvars, groups, name, servers[0])
        else:
            server_ids = set()
            # Trap for duplicate results
            for server in servers:
                server_ids.add(server['id'])
            if len(server_ids) == 1 and use_hostnames:
                append_hostvars(hostvars, groups, name, servers[0])
            else:
                for server in servers:
                    append_hostvars(
                        hostvars, groups, server['id'], server,
                        namegroup=True)
    groups['_meta'] = {'hostvars': hostvars}
    return groups


def is_cache_stale(cache_file, cache_expiration_time, refresh=False):
    ''' Determines if cache file has expired, or if it is still valid '''
    if refresh:
        return True
    if os.path.isfile(cache_file) and os.path.getsize(cache_file) > 0:
        mod_time = os.path.getmtime(cache_file)
        current_time = time.time()
        if (mod_time + cache_expiration_time) > current_time:
            return False
    return True


def get_cache_settings(cloud=None):
    config_files = cloud_config.CONFIG_FILES + CONFIG_FILES
    if cloud:
        config = cloud_config.OpenStackConfig(
            config_files=config_files).get_one(cloud=cloud)
    else:
        config = cloud_config.OpenStackConfig(
            config_files=config_files).get_all()[0]
    # For inventory-wide caching
    cache_expiration_time = config.get_cache_expiration_time()
    cache_path = config.get_cache_path()
    if cloud:
        cache_path = '{0}_{1}'.format(cache_path, cloud)
    if not os.path.exists(cache_path):
        os.makedirs(cache_path)
    cache_file = os.path.join(cache_path, 'ansible-inventory.cache')
    return (cache_file, cache_expiration_time)


def to_json(in_dict):
    return json.dumps(in_dict, sort_keys=True, indent=2)


def parse_args():
    parser = argparse.ArgumentParser(description='OpenStack Inventory Module')
    parser.add_argument('--cloud', default=os.environ.get('OS_CLOUD'),
                        help='Cloud name (default: None')
    parser.add_argument('--private',
                        action='store_true',
                        help='Use private address for ansible host')
    parser.add_argument('--refresh', action='store_true',
                        help='Refresh cached information')
    parser.add_argument('--debug', action='store_true', default=False,
                        help='Enable debug output')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--list', action='store_true',
                       help='List active servers')
    group.add_argument('--host', help='List details about the specific host')

    return parser.parse_args()


def main():
    args = parse_args()
    try:
        # openstacksdk library may write to stdout, so redirect this
        sys.stdout = StringIO()
        config_files = cloud_config.CONFIG_FILES + CONFIG_FILES
        sdk.enable_logging(debug=args.debug)
        inventory_args = dict(
            refresh=args.refresh,
            config_files=config_files,
            private=args.private,
            cloud=args.cloud,
        )
        if hasattr(sdk_inventory.OpenStackInventory, 'extra_config'):
            inventory_args.update(dict(
                config_key='ansible',
                config_defaults={
                    'use_hostnames': False,
                    'expand_hostvars': True,
                    'fail_on_errors': True,
                }
            ))

        inventory = sdk_inventory.OpenStackInventory(**inventory_args)

        sys.stdout = sys.__stdout__
        if args.list:
            output = get_host_groups(inventory, refresh=args.refresh, cloud=args.cloud)
        elif args.host:
            output = to_json(inventory.get_host(args.host))
        print(output)
    except sdk.exceptions.OpenStackCloudException as e:
        sys.stderr.write('%s\n' % e.message)
        sys.exit(1)
    sys.exit(0)


if __name__ == '__main__':
    main()
