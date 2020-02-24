import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toggle from 'react-toggle'
import * as request  from './request';
import _ from "lodash";
import Axios from 'axios';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
 import { Container, Row, Col } from 'react-grid';
import { baseUrl, baseUrlApi } from '../config';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;
const wrapperStyle = { width: 400, margin: 50 };


class ViewFeed extends Component {
    
    constructor(props) { 
        super(props);
        this.view = this.props.match.params.count
        this.state = {
            camera1 : true,
            camera2 : true,
            view : this.view,
            camera1data : [],
            imagecountc1 : 0,
            currentFramec1 : {},
            frameRate: 7.5,
            playingSpeed : 500,
            ind : 0,
            skipIndex : 3,
            s1Value : 0,
            playDisable1 : true,
            camera2data : [],
            imagecountc2 : 0,
            currentFramec2 : {},
            ind2 : 0,
            s2Value : 0,
            playDisable2 : true,
            c1Date: new Date(),
            c2Date: new Date(),
            baseUrl :baseUrl,
            baseUrlApi : baseUrlApi,
            c1videos:[],
            c2videos:[],
            showcamera1 : true,
            showcamera2 : true,

          };
    }

    c1interval = null;
    c2interval = null;

    componentDidMount = () => {
        console.log("Compoment did mount")

        if(this.state.view === "1")
        {
            this.setState({showcamera2: false})
        }
        else if(this.state.view === "2")
        {
            console.log("Both are present")
        }
        else
        {
            this.setState({showcamera2: false},{showcamera1:false})
        }
    }

    handleChangeDate=(dateType,date)=> {
        this.setState({
            [dateType]: date
          },()=>{
            if(dateType === "c1Date")
            {
                this.getCameraVideos(1)
            }
            else{
                this.getCameraVideos(2)
            }
          });
        
        
        

        // if(camera === 1)
        // {
        //     // clearInterval(this.c1interval)
        //     // this.getAllFrames(1)
        //     // this.setState({
        //     //     // camera1data : [],
        //     //     // imagecountc1 : 0,
        //     //     // currentFramec1 : {},
        //     //     // ind : 0,
        //     //     // s1Value : 0,
        //     //     // playDisable1 : true
        //     // })

            
        // }
        // else
        // {
        //     // clearInterval(this.c2interval)
        //     // this.getAllFrames(2)
        //     // this.setState({
        //     //     camera2data : [],
        //     //     imagecountc2 : 0,
        //     //     currentFramec2 : {},
        //     //     ind2 : 0,
        //     //     s2Value : 0,
        //     // })


        // }
    }

    handleChange(flag) {
        // if(flag === 1)
        // {
        //     this.setState({camera1: !this.state.camera1,});
        //     if(this.state.camera1 === true){
        //         this.getAllFrames(1)
        //     }
        //     else
        //     {
        //         clearInterval(this.c1interval)
        //     }
        // }
        // else{
        //     this.setState({camera2: !this.state.camera2,});
        //     if(this.state.camera2 === true){
        //         this.getAllFrames(2)
        //     }
        //     else
        //     {
        //         clearInterval(this.c2interval)
        //     }
        // }
    }

    getAllFrames = (camera) => {
        Axios.get("http://localhost:3001/getframes")
            .then(res => {
                let response = res['data']
                if (response.status === 200) {
                let data = response.data
                if(camera === 1)
                {
                    this.setState({camera1data : data,imagecountc1:data.length,currentFramec1 : data[0], ind : 0, playDisable1 : true})    
                }
                else
                {
                    this.setState({camera2data : data,imagecountc2:data.length,currentFramec2 : data[0], 
                        ind2 : 0, playDisable2 : true})
                }
                
                this.handlePlay(0,camera)
                } else {
                    // alert("Server not reached")
                    console.log("server not reached")
                }
            })
            .catch(err => {
      
        });
        // let data = request.getAllFrames()
        // if(data){
        //     console.log("########")
        //     console.log(data)
        //     this.setState({camera1data : data,imagecountc1:data.length})
        // }
    }

    getRandomNumber = (num1, num2, length) => {
        var arr = [];
        let firstvalue = num2 / length
    
        let temp = parseInt(firstvalue)
        _.range(length).forEach(element => {
          arr.push(parseInt(temp))
          temp = temp + firstvalue
        });
        return arr
    }

    getSecForFrame = frame => {
        let d = frame / this.state.frameRate;
        var h = Math.floor(d / 3600);
        var m = Math.floor((d % 3600) / 60);
        var s = Math.floor((d % 3600) % 60);
        s = s.toString().length === 1 ? '0' + s : s;
        m = m.toString().length === 1 ? '0' + m : m;
        h = h.toString().length === 1 ? '0' + h : h;
        let timesheet = h + ':' + m + ':' + s;
    
        return timesheet;
      };
    
    sliderChange = (value) => {
        let playIndex = value
        this.processPlayIndex(playIndex)
    }

    handlePlay = (ind, camera) => {
        if(camera === 1)
        {
            clearInterval(this.c1interval) 
        }
        else{
            clearInterval(this.c2interval)
        }
        let playIndex = ind
        this.processPlayIndex(playIndex,camera)
    }

    processPlayIndex = (playIndex,camera) => {
        if(camera === 1)
        {
            let { playingSpeed, ind, skipIndex, imagecountc1, camera1data , currentFramec1 } = { ...this.state }
            this.c1interval = setInterval(() => {
              playIndex = playIndex + skipIndex
              if (playIndex < parseInt(imagecountc1)) {
                this.setState({ playIndex, ind: parseInt(playIndex),currentFramec1 : camera1data[parseInt(playIndex)]  })
                this.markerMove(parseInt(playIndex),camera);
              }
              else {
                clearInterval(this.c1interval)
              }
            }, playingSpeed);
        }
        else
        {
            let { playingSpeed, ind2, skipIndex, imagecountc2, camera2data , currentFramec2 } = { ...this.state }
            this.c2interval = setInterval(() => {
              playIndex = playIndex + skipIndex
              if (playIndex < parseInt(imagecountc2)) {
                this.setState({ playIndex, ind2: parseInt(playIndex),currentFramec2 : camera2data[parseInt(playIndex)]  })
                this.markerMove(parseInt(playIndex),camera);
              }
              else {
                clearInterval(this.c2interval)
              }
            }, playingSpeed);
        }
        
      }

    markerMove = (index,camera) => {
        if(camera === 1)
        {
            this.setState({s1Value : index} )    
        }
        else
        {
            this.setState({s2Value : index} )
        }
        
    }

    getCameraVideos = (cameraID) => {
        let selectedDate = null
        if(cameraID === 1)
        {
            selectedDate = this.state.c1Date
        }
        else{
            selectedDate = this.state.c2Date
        }
        let payload = {
            "camera_id" : cameraID,
            "date":selectedDate
        }
        let data = request.getCameraVideos(payload).then(response => {
            if(response.status == 200){
                if(cameraID === 1)
                {
                    this.setState({c1videos : response.data})
                }
                else
                {
                    this.setState({c2videos : response.data})
                }
            }
            else
            {
              console.log("Server Error")
            }
        });
    }

    render() {
        const handle = (props) => {
            const { value, dragging, index, ...restProps } = props;
            
            return (
              <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={value}
                visible={dragging}
                placement="top"
                key={index}
              >
                <Handle value={value} {...restProps} />
              </Tooltip>
            );
          };

        let {camera1,camera2,c1videos,c2videos,baseUrl,baseUrlApi} = { ...this.state }
        return (
            <div  className="mt-4">
               <div className="row text-center" >
              <header className="col-12 text-center ">
                <h2 className="head">Camera View</h2>
                </header>
                </div>
                <div className="row">
                    <div className="col-md-6 videobox">
                    { this.state.showcamera1 === true ? 
                        <div>
                            <div className="toggleclass">
                                <div className="d-inline">
                                
                                <button className={" mt-2 btn "+(camera1?" btn-primary":" btn-danger")}  onClick={e=>{this.setState({camera1:!camera1}), this.getCameraVideos(1)}}>
                                <span className="live  text-white"> {camera1 ?"Go File":"Go Live"}</span></button>
                                {!camera1?<span className="dateclass float-right ">
                                        <DatePicker className="form-control"
                                        selected={this.state.c1Date}
                                        onChange={date=>this.handleChangeDate('c1Date',date)}
                                    />
                                    </span>:null}
                                </div>
                            
                            </div>
                            { this.state.camera1 === true ? 
                                
                                <div className="text-center">
                                    <section className="card card-featured card-featured-primary mt-2">
                                        <div className="card-body pt-2">
                                            <div className=" center position-relative">
                                            <Container>
                                                <Row>
                                                <div className="row" >
                                                <img className="videourl" src="http://127.0.0.1:3001/video_feed/1" 
                                                    width="650" height="450" alt=""></img>
                                                </div>
                                                </Row>
                                                </Container>
                                                    <br />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                : 
                                <div className="text-center  ">
                                    
                                    <section className="card card-featured card-featured-primary mt-2">
                                        <div className="card-body pt-2">
                                            <div className=" center position-relative">
                                            <Container>
                                                <Row>
                                                <div className="row" >
                                                    {c1videos&&c1videos.length>0?c1videos.map((video,index)=>

                                                    
                                                    <span className="col-6" >
                                                    <Col sm>   
                                                    <video width="300" height="250" 
                                                        src={baseUrlApi+"/"+video.video_path}
                                                        className=" videourl loaded mr-1" 
                                                        controls     type="video/mp4"
                                                        ></video></Col>
                                                        <p className="time">Time : {video.start_time} - {video.end_time}</p>
                                                        </span>
                                                    
                                                    ):null
                                                        }
                                                </div>
                                                </Row>
                                                </Container>
                                                    <br />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            }
                        </div>

                        : null }
                        
                    </div>
                    
                    <div className="col-md-6 videobox">
                        { this.state.showcamera2 === true ?
                        <div>
                            <div className="toggleclass">
                                <div className="d-inline">
                                    <button className={" mt-2 btn "+(camera2?" btn-primary":" btn-danger")}  onClick={e=>{this.setState({camera2:!camera2}),this.getCameraVideos(2)}}>
                                        <span className="live  text-white"> {camera2 ?"Go File":"Go Live"}</span></button>
                                        {!camera2?<span className="dateclass float-right ">
                                        <DatePicker className="form-control"
                                        selected={this.state.c2Date}
                                        onChange={date=>{this.handleChangeDate("c2Date",date)}}
                                    />
                                    </span>:null}
                                </div>
                            
                            </div>
                            { this.state.camera2 === true ? 
                                <div className="text-center">
                                    <section className="card card-featured card-featured-primary mt-2">
                                        <div className="card-body pt-2">
                                            <div className=" center position-relative">
                                            <Container>
                                                <Row>
                                                <div className="row" >
                                                <img className="videourl" src="http://127.0.0.1:3001/video_feed/2" 
                                                    width="650" height="450" alt=""></img>
                                                </div>
                                                </Row>
                                                </Container>
                                                    <br />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                : 
                                <div className="text-center  ">
                                    
                                    <section className="card card-featured card-featured-primary mt-2">
                                        <div className="card-body pt-2">
                                            <div className=" center position-relative">
                                            <Container>
                                                <Row>
                                                    {c2videos&&c2videos.length>0?c2videos.map((video,index)=>
                                                     <span className="col-6" >
                                                    <Col sm>   
                                                    <video width="300" height="250" 
                                                        src={baseUrlApi+"/"+video.video_path}
                                                        className=" videourl loaded mr-1" 
                                                        controls     type="video/mp4"
                                                        ></video></Col>
                                                        <p className="time1">Time : {video.start_time} - {video.end_time}</p>
                                                        </span>
                                                    ):null
                                                        }
                                                </Row>
                                                </Container>
                                                    <br />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            }
                        </div>
                        : null }
                        


                    </div>
                </div>
            </div>
        );
      }
}

export default ViewFeed;
