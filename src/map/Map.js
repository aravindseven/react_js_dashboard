import React, { Component } from 'react';
import L from 'leaflet'; // Same as `import * as L from 'leaflet'` with webpack

import bluemarker from '../assets/images/marker-blue.png';
import greenmarker from '../assets/images/marker-green.png';
import redmarker from '../assets/images/marker-red.png';
import darkmarker from '../assets/images/marker-dark.png';
import markershadow from '../assets/images/marker-shadow.png';
import cameramarker from '../assets/images/camera.jpg';
import cameratickmarker from '../assets/images/cameratick.jpg';
import sensormarker from '../assets/images/sensor.png';
import sensortickmarker from '../assets/images/sensortick.png';
import telescopemarker from '../assets/images/telescope.png';
import telescopetickmarker from '../assets/images/telescopetick.png';

import '../assets/css/map.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toggle/style.css"
import Toggle from 'react-toggle'
import * as request  from './request';

const cameraIcon = L.icon({
  iconUrl: cameramarker,
  shadowUrl: markershadow,

  iconSize:     [30, 25], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 41],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


const cameratickIcon = L.icon({
  iconUrl: cameratickmarker,
  shadowUrl: markershadow,

  iconSize:     [30, 25], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 41],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const sensorIcon = L.icon({
  iconUrl: sensormarker,
  shadowUrl: markershadow,

  iconSize:     [30, 30], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 41],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const sensortickIcon = L.icon({
  iconUrl: sensortickmarker,
  shadowUrl: markershadow,

  iconSize:     [30, 30], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 41],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const telescopeIcon = L.icon({
  iconUrl: telescopemarker,
  shadowUrl: markershadow,

  iconSize:     [30, 30], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 41],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const telescopetickIcon = L.icon({
  iconUrl: telescopetickmarker,
  shadowUrl: markershadow,

  iconSize:     [30, 30], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 41],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


class Map extends Component {
  
  constructor(props) {
    super(props);
  
  this.state = {
    showSigned: true,
    showSpoken: true,
    showWritten: true,
    showUnknown: true,
    ipaccess:true,
    feed : false
  };
}

  dist_map = 0
  tempID = 0
  markers = []
  selectedCamera = []
  selectedIcon = (iconselected) => {
    this.tempID = this.tempID + 1
    let pid= 0
    let icon = 0
    if(iconselected === 1)
    {
        icon = cameraIcon
        pid = "c"
    }
    if(iconselected === 2)
    {
        icon = telescopeIcon
        pid = "t"
    }
    if(iconselected === 3)
    {
        icon = sensorIcon
        pid = "s"
    }

    this.plotMarkers(pid,0,icon)

  }

  selectedMarkers = (evt,point) => {
    var index = this.selectedCamera.indexOf(evt.options.pid)
    console.log(evt.options.pid)
    let markerType = evt.options.pid.split("_")[0]
      if (index !== -1) {
        this.selectedCamera.splice(index, 1);
        //back to normal icon
        if(markerType === "c")
        {
          point.setIcon(cameraIcon)
        }
        if(markerType === "t")
        {
          point.setIcon(telescopeIcon)
        }
        if(markerType === "s")
        {
          point.setIcon(sensorIcon)
        }
        
      }
      else{
        this.selectedCamera.push(evt.options.pid)
        if(markerType === "c")
        {
          point.setIcon(cameratickIcon)
        }
        if(markerType === "t")
        {
          point.setIcon(telescopetickIcon)
        }
        if(markerType === "s")
        {
          point.setIcon(sensortickIcon)
        }
      }

      if(this.selectedCamera.length == 0)
      {
        this.setState({feed : false})
      }
      else{
        this.setState({feed : true})
      }
  }

  viewFeed() {
    if(this.selectedCamera.length > 2)
    {
        alert("Please select 2 cameras at a time !!")
        return
    }
    if(this.selectedCamera.length == 0)
    {
        alert("Please select altleast 1 camera to view feed !!")
        return
    }

    this.props.history.push('/viewfeed/'+this.selectedCamera.length)
  }

  plotMarkers(points,fromwhere,icon) {
    let pid = 0
    if(fromwhere === 1)
    {
       this.tempID = points.length
       for(var i=0;i<points.length;i++) 
       {
          let data = points[i]
          
          if(data.type === 1)
          {
              icon = cameraIcon
              pid = "c"
          }
          if(data.type === 2)
          {
              icon = telescopeIcon
              pid = "t"
          }
          if(data.type === 3)
          {
              icon = sensorIcon
              pid = "s"
          }

          pid = pid+"_"+data.id
          // Loading already saved points into Map
          this.loadMap(pid,icon,data.lat,data.long)
       }
      }
     else
     {
        pid = points
        pid =pid+"_"+this.tempID
        // Loading new point Temp point
        this.loadMap(pid,icon,this.dist_map.getCenter().lat,this.dist_map.getCenter().lng)
        let tempObj = {}
        tempObj.lat = this.dist_map.getCenter().lat
        tempObj.long = this.dist_map.getCenter().lng
        tempObj.type = pid.split("_")[0]
        
        this.markers.push(tempObj);
     }
       
    
  }

  loadMap(pid,icon,lat,long){
    var options = {
        pid:  pid,
        icon: icon,
        draggable: true
      };

      let self = this
      var point = L.marker([lat, long],options).addTo(this.dist_map);
      point.on('dragend', function(evt){
        var marker = evt.target;
        var position = marker.getLatLng();
        point.setLatLng(position,{draggable:'true'}).update();
      });

      point.on('click', function(evt){
        self.selectedMarkers(evt.target,point)
      })
      
      
  }

  handleChange() {
    this.setState({
      ipaccess: !this.state.ipaccess,
    });
    let {ipaccess} = {...this.state}
    
  }

  componentDidMount() {

    let data = request.getAllPoints().then(response => {
            if(response.status == 200){

                this.dist_map = L.map('mapid').setView([response.lat, response.long], 9);
                L.tileLayer(
                  'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
                  {
                    maxZoom: 10,
                    draggable: true,
                    id: 'mapbox.streets',
                    accessToken:
                      'pk.eyJ1IjoicHJvdG9jb2w3IiwiYSI6ImNrMjUxZjEzYTAwbXYzbHRscnE5dDFnOWQifQ.uOVge_4xINbcWwQ8gA-rGg',
                  }
                ).addTo(this.dist_map);
                this.markers = response.data
                this.setState({points : response.data})
                //Add Markers
                this.plotMarkers(response.data,1,null)
            }
            else
            {
              console.log("Server Error")
            }
        });
    
  }

  render() {
    return (

     <div className="row">
         <header className={'page-header header-center'}>
            <h2 className="head">Distribution Management</h2> 
          </header>
          { this.state.feed === true ?
            <button className="buttonclass" onClick={e=>{this.viewFeed()}}>View Feed</button>
            : null 
          }
          
         <div id="mapid"/>
         <div id="box">Place on the map :
          <span class="poi-type"><img class="drag" type="tree" src={cameramarker} alt="" onClick={e=>{this.selectedIcon(1)}}/></span>
          <span class="poi-type"><img class="drag" type="red" src={telescopemarker} alt="" onClick={e=>{this.selectedIcon(2)}}/></span>
          <span class="poi-type"><img class="drag" type="black" src={sensormarker} alt="" onClick={e=>{this.selectedIcon(3)}}/></span>
        </div>
      </div>
    
      
    );
  }
}

export default Map;
