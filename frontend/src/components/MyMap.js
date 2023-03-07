import {useState, useRef} from 'react';
import Map, {NavigationControl, FullscreenControl, GeolocateControl, Marker, Popup} from 'react-map-gl';

import {Card} from 'react-bootstrap'; 

import {MdDirectionsBike, MdLocationPin} from 'react-icons/md';
import {FaMapMarkerAlt} from 'react-icons/fa';

import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/myMap.css';


const MyMap = ({height, handleCurrentLocation=null, currentLocation=null, viewOnly=false, popUp=false, handleDeliveryAddress=null, deliveryLocation=null}) => {

    const mapRef = useRef();

    const [viewport, setViewport] = useState({
        longitude:  55.2737617,
        latitude:  25.2208602,
        zoom: 14
    });

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');

    //const [currentLocation, setCurrentLocation] = useState(null);

    // useEffect(() => {
    //     if(currentLocation) {
    //         mapRef.current?.flyTo({center: [currentLocation.long, currentLocation.lat], duration: 500});
    //     }
    //     if(deliveryLocation) {
    //         console.log('delivery location');
    //         mapRef.current?.flyTo({center: [deliveryLocation.long, deliveryLocation.lat], duration: 500});
    //     }

    // }, [currentLocation, deliveryLocation]);

    const handleMapLoad = () => {
        
        if(currentLocation) {
            mapRef.current?.flyTo({center: [currentLocation.long, currentLocation.lat], duration: 500});
        }
        if(deliveryLocation) {
            console.log('delivery location');
            mapRef.current?.flyTo({center: [deliveryLocation.long, deliveryLocation.lat], duration: 500});
        }
    }

    const handleDoubleClick = e => {

        if(viewOnly) return;

        //mapRef.current?.flyTo({center: [e.lngLat.lng, e.lngLat.lat], duration: 500});

        handleCurrentLocation({
            lat: e.lngLat.lat,
            long: e.lngLat.lng
        });
    }

    const handleSubmit = e => {
        e.preventDefault();

        if(handleDeliveryAddress({address, city, zip})) {
            setAddress('');
            setCity('');
            setZip('');
        }
        
    }

    return (
        <div>
            <Map
                ref={mapRef}
                initialViewState={viewport}
                style={{width: '100%', height}}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_PUBLIC_API}
                doubleClickZoom={viewOnly}
                onDblClick={handleDoubleClick}
                onMove={evt => setViewport(evt.viewState)}
                onLoad={handleMapLoad}
            >
                <FullscreenControl position="top-right" />
                <GeolocateControl position="top-right" />
                <NavigationControl position="top-right" />
                <Marker
                    latitude={25.2208602}
                    longitude={55.2737617}
                    offset={[0,0]}
                >
                    <div className='myMap-shop-location'>
                        <span className='myMap-shop-location-bike-icon'><MdDirectionsBike fontSize={viewport.zoom * 2}  /></span>
                        <MdLocationPin fontSize={viewport.zoom * 4} color='red' cursor='pointer' />
                        {/* <div class='pin'></div>
                        <div class='pulse'></div> */}
                        {viewport.zoom >= 11 && (
                            <div className='myMap-shop-location-details'>
                                <Card style={{ width: `${viewport.zoom * 17.857}px` }} className='d-flex flex-column align-items-center'>
                                    <div className='myMap-shop-location-details-image mt-3'>
                                        <img src='/img/logo.png' alt='shop' />
                                    </div>
                                    <Card.Body className='pb-5'>
                                        <Card.Title className='text-center'>Satwa Bike Shop</Card.Title>
                                        <Card.Text>
                                        Some quick example text to build on the card title and make up the
                                        bulk of the card's content.
                                        </Card.Text>
                                        
                                    </Card.Body>
                                </Card>
                            </div>
                        )}
                        

                    </div>
                </Marker>
                {currentLocation && (
                    <Marker
                        latitude={currentLocation.lat}
                        longitude={currentLocation.long}
                        offset={[0,0]}
                    >
                        <div className='myMap-your-location'>
                            {!popUp && (<span style={{fontSize: viewport.zoom * 1}}>{viewOnly ? 'customer' : popUp ? 'delivery' : 'your'} location</span>)}
                            <FaMapMarkerAlt fontSize={viewport.zoom * 4} color='orange' cursor='pointer' />
                        </div>
                    </Marker>
                )}

                {deliveryLocation && (
                    <Marker
                        latitude={deliveryLocation.lat}
                        longitude={deliveryLocation.long}
                        offset={[0,0]}
                    >
                        <div className='myMap-your-location'>
                            <span style={{fontSize: viewport.zoom * 1}}>delivery location</span>
                            <FaMapMarkerAlt fontSize={viewport.zoom * 4} className='text-primary' cursor='pointer' />
                        </div>
                    </Marker>
                )}

                {currentLocation && popUp && (
                    <Popup 
                        longitude={currentLocation.long} 
                        latitude={currentLocation.lat}
                        anchor="right"
                        onClose={() => handleCurrentLocation(null)}
                        closeOnClick={false}
                    >
                        <form className='p-3' style={{width: '350px'}} onSubmit={handleSubmit}>

                            <div className='myMap-form-group'>
                                <label className='text-secondary'>Address</label>
                                <input type='text' value={address} onChange={e => setAddress(e.target.value)}  />
                            </div>
   
                            <div className='myMap-form-group'>
                                <label className='text-secondary'>City</label>
                                <input type='text' value={city} onChange={e => setCity(e.target.value)}   />
                            </div>
                        
                            <div className='myMap-form-group'>
                                <label className='text-secondary'>Postal Code (Zip code)</label>
                                <input type='text' value={zip} onChange={e => setZip(e.target.value)}   />
                            </div>

                            <button className='btn btn-dark btn-sm' style={{margin: '0 auto', display: 'block'}}>Confirm Delivery Info</button>
                            
                        </form>
                    </Popup>
                )}
            </Map>
        </div>
    );

}

export default MyMap;