FROM python:3

WORKDIR /usr/src/app

COPY . .

# Install dependencies
RUN pip install -r requirements.txt

CMD [ "python", "-u", "./harvester.py"]



