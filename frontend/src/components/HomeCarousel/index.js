import React from 'react';
import {Carousel} from "antd";
import "./index.scss"

function HomeCarousel() {
    const authors = [
        {
            name: "Jinyu Tan",
            stuid: "1184788",
            role: "Backend Developer",
            desc: "Job description.",
        },
        {
            name: "Ruoyi Gan",
            stuid: "987838",
            role: "Data analyst",
            desc: "Job description.",
        },
        {
            name: "Yuanzhi Shang",
            stuid: "1300135",
            role: "Operations",
            desc: "Writing Ansible script for dynamic deployment, including MRC resources allocation, Couchdb cluster setup, Twitter-Harvester, Frontend and Backend deployment.",
        },
        {
            name: "Zixuan Guo",
            stuid: "1298930",
            role: "Data analyst",
            desc: "Job description.",
        },
        {
            name: "Zuguang Tong",
            stuid: "1273868",
            role: "Frontend Developer",
            desc: "Build a website with React as the front-end framework, use Google Maps API to visualize geographic data, and use ant design as UI library and chart display.",
        }
    ]
    return <Carousel autoplay autoplaySpeed={3000}>
            {
                authors.map((author) => (
                    <div className='carousel_card' key={author.stuid}>
                        <h3 className='name'>{author.name} <span className="stuId"> - {author.stuid}</span></h3>
                        <p className='role'>Role:  {author.role}</p>
                        <p className='description'>{author.desc}</p>
                    </div>
                ))
            }
            </Carousel>
}

export default HomeCarousel;