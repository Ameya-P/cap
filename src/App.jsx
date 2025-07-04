import { useState } from 'react'
import './App.css'
import APIForm from './Components/APIForm';
import Gallery from './Components/Gallery';
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [quota, setQuota] = useState(null);

  const [screenshotGallery, setScreenshotGallery] = useState([]);

  const [currentImage, setCurrentImage] = useState("");

  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });

  const submitForm = (e) => {
    e.preventDefault();
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    if (!inputs.url || inputs.url.trim() == "") {
      alert("Please input a url!");
    } else {
      for (const [key, value] of Object.entries(inputs)) {
        if (value == "") {
          inputs[key] = defaultValues[key]
        }
      }

      makeQuery();

    }
  }

  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;

    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;

    callAPI(query).catch(console.error);
  }

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();

    if (!json.url || json.url.trim() == "") {
      alert("We weren't able to screenshot your website!");
    } else {

      setCurrentImage(json.url.trim());

      setScreenshotGallery((prevState) => ([
            ...prevState,
            json.url.trim(),
          ]))

      reset();

      getQuota();
    }
  }

  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    })
  }

  const getQuota = async () => {
    const response = await fetch("https://api.apiflash.com/v1/urltoimage/quota?access_key=" + ACCESS_KEY);
    const result = await response.json();

    setQuota(() => ({
            ...result
          }));
  }

  return (
    <div className="whole-page">
      <h1>Build Your Own Screenshot! 📸</h1>

      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />

      <div className="image-container">
        {currentImage ? (
          <img
            className="screenshot"
            src={currentImage}
            alt="Screenshot returned"
          />
        ) : (
          <div>
            <p className="big-paragraph">No Screenshot</p>
          </div>
        )}
      </div>

      <div className="container">
        <h3> Current Query Status: </h3>
        <br></br>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
          <br></br>
        </p>

        {quota && <p className="quota">Remaining API Calls: {quota.remaining} out of {quota.limit}</p>}

      </div>

      <div className="container">
        <Gallery images={screenshotGallery} />
      </div>
    </div>
  );
}

export default App
