function getAddress (latitude, longitude) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    var data = JSON.parse(request.responseText);
                    var address = data.results[0];
                    resolve(address);
                }
                else {
                    reject(request.status);
                }
            }
        };
        request.send();
    });
};





function Weather() {
    const [position, setPosition] = React.useState([null,null])
    const [country, setCountry] = React.useState("")
    const [city, setCity] = React.useState("")
    const [tempType, setTempType] = React.useState("C") //F
    const [temp, setTemp] = React.useState("")
    const [weather, setWeather] = React.useState("")
    const [image, setImage] = React.useState("")

    React.useEffect(() => {
        getLocation()
    }, [])

    React.useEffect(() => {
        // console.log(position)
        getWeather()
    }, [position])
    
    function getWeather(){
        if(position[0] && position[1]){
           

            fetch(`https://weather-proxy.freecodecamp.rocks/api/current?lat=${position[0]}&lon=${position[1]}`)
            .then(response => response.json())
            .then(response=>{
                console.log(response["name"])
                setCountry(response["sys"]["country"])
                setCity(response["name"])
                setWeather(response["weather"][0]["main"])
                setImage(response["weather"][0]["icon"])
                setTemp(response["main"]["temp"])
            })


        }

    }

    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getPosition);
        } 
      }
      
    function getPosition(position) {
        setPosition([position.coords.latitude,position.coords.longitude])
        // console.log(position.coords.latitude,position.coords.longitude)
    }

    function convertTemp(){
        if(tempType === "C"){
            setTemp(((temp * 9/5) + 32).toFixed(2))
            setTempType("K")
        }else{
            setTemp(((temp - 32) * 5/9).toFixed(2))
            setTempType("C")
        }
    }
  

    return(
        <div>
            {temp ? 
                <div id="weather-data">
                    <p id="location">{city}, {country}</p>

                    <div id="temp-display">
                        <p id="temp">
                            <span>{temp} °</span>
                            <span>
                                <a className="link-primary" id="temp-change" onClick={convertTemp}>{tempType}</a>
                            </span>
                        </p>
                        
                    </div>

                    <p id="weather">{weather}</p>

                    <div id="weather-icon">
                        <img src={image}></img>
                    </div>
                </div>
            :
                false
            }
        </div>
    );
}



ReactDOM.render(<Weather />,document.querySelector('#content'));