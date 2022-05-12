import React from 'react';
import {Carousel} from "antd";
import "./index.scss"

function HomeCarousel() {
    const authors = [
        {
            name: "Jinyu Tan",
            stuid: "1234567",
            role: "Backend Developer",
            desc: "Job description.",
        },
        {
            name: "Ruoyi Gan",
            stuid: "1234567",
            role: "Data analyst",
            desc: "Job description.",
        },
        {
            name: "Yuanzhi Shang",
            stuid: "1234567",
            role: "Operations",
            desc: "Job description.",
        },
        {
            name: "Zixuan Guo",
            stuid: "1234567",
            role: "Data analyst",
            desc: "Job description.",
        },
        {
            name: "Zuguang Tong",
            stuid: "1273868",
            role: "Frontend Developer",
            desc: "Built a front-end app that uses React as a framework, Google Maps API and Ant Design as a visualization tool.",
        }
    ]
    return <Carousel autoplay autoplaySpeed={3000}>
            {
                authors.map((author) => (
                    <div className='carousel_card' key={author.stuid}>
                        <h3 className='name'>{author.name} <span className="stuId"> - {author.stuid}</span></h3>
                        <p className='role'>Role: {author.role}</p>
                        <p className='description'>{author.desc}</p>
                    </div>
                ))
            }
            </Carousel>
}

export default HomeCarousel;