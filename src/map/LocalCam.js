import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Webcam from "react-webcam";
import Toggle from 'react-toggle'

class LocalCam extends Component {


    constructor(props) {
        super(props);
        this.state = {
            camera1 : true,
            camera2 : true,
          };
      }

    setRef = webcam => {
        this.webcam = webcam;
      };
    
    capture = () => {
      const imageSrc = this.webcam.getScreenshot();
      };
    render() {
        const videoConstraints = {
          width: 1280,
          height: 720,
          facingMode: "user"
        };
    
        return (
          <div>
            <div className="row">
                <header className={'page-header header-center'}>
                    <h2 className="head">Local Web Cam</h2> 
                </header>
            </div>
            <div className="row">
                <div className="col-md-6 videobox">
                  <span className="toggleclass">  
                    <Toggle
                      defaultChecked={this.state.camera1}
                      aria-label=''
                      onChange={e => {this.handleChange(1)}} />
                      { this.state.camera1 
                            ? <div>This is visible</div>
                            : null
                        }
                  </span>
                    <Webcam className="video"
                    audio={false}
                    height={350}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={450}
                    videoConstraints={videoConstraints}
                    />
                    
                </div>
                <div className="col-md-6 videobox">
                    <span className="toggleclass">  
                      <Toggle
                        defaultChecked={this.state.camera2}
                        aria-label=''
                        onChange={e => {this.handleChange(2)}} />
                        { this.state.camera2 
                              ? <div>This is visible</div>
                              : null
                          }
                    </span>
                    <Webcam className="video"
                    audio={false}
                    height={350}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={450}
                    videoConstraints={videoConstraints}
                    />
                    
                </div>
                
            </div>
          </div>
            
        );
      }
}

export default LocalCam;
