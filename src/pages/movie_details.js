import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../movie_details.css";
import fire from "../files/firebase";

export const MovieDetails = () => {
  const location = useLocation();
  var viedourl = location.state.viedourl;
  var moviename = location.state.moviename;
  var description = location.state.description;
  var actorname = location.state.actorname;
  var directorname = location.state.directorname;
  var releasedate = location.state.releasedate;
  var outdate = location.state.outdate;
  var theatername = location.state.theatername;
  const [review, setreview] = useState("");
  const [data, setdata] = useState([]);
  const handleSubmit = e => {
    e.preventDefault();
    if (review === "") {
      alert("please enter review");
    } else {
      fire
        .firestore()
        .collection("reviews")
        .add({
          profile: localStorage.getItem("profile"),
          username: localStorage.getItem("name"),
          email: localStorage.getItem("email"),
          moviename: moviename,
          review: review,
          theatername: theatername
        })
        .then(() => {
          window.location.reload(true);
          setreview("");
        })
        .catch(err => console.log(err));
    }
  };

  useEffect(() => {
    fire
      .firestore()
      .collection("reviews")
      .where("moviename", "==", moviename)
      .where("theatername", "==", theatername)
      .get()
      .then(snapshot => {
        snapshot.forEach(ele => {
          var data = ele.data();
          setdata(arr => [...arr, { data: data }]);
        });
      });
  }, []);

  return (
    <div style={{ flexDirection: "column" }}>
      <div>
        <iframe width="450" height="300" className="viedo" src={viedourl} />
      </div>
      <div
        className="card"
        style={{ width: "70%", marginLeft: "16%", background: "lightpink" }}
      >
        <h2 style={{ fontWeight: "normal", fontSize: "larger" }}>
          moviename : {moviename}
        </h2>
        <h2 style={{ fontWeight: "normal", fontSize: "larger" }}>
          Description : {description}
        </h2>
        <h2 style={{ fontWeight: "normal", fontSize: "larger" }}>
          Actor Name : {actorname}
        </h2>
        <h2 style={{ fontWeight: "normal", fontSize: "larger" }}>
          Director Name : {directorname}
        </h2>
        <h2 style={{ fontWeight: "normal", fontSize: "larger" }}>
          Release Date : {releasedate}
        </h2>
        <h2 style={{ fontWeight: "normal", fontSize: "larger" }}>
          Out Date : {outdate}
        </h2>
        <br />
      </div>
      <div
        style={{
          display: "flex",
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <input
          type="text"
          value={review}
          placeholder="Give Your Review"
          onChange={e => setreview(e.target.value)}
        />
        &nbsp;&nbsp;
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <br />
      <div style={{ marginLeft: "15%" }}>
        {data.map((data, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "aliceblue",
                margin: "20px",
                padding: "20px"
              }}
            >
              <div style={{ display: "flex" }}>
                <img
                  src={data.data.profile}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    display: "block"
                  }}
                />&nbsp;&nbsp;
                <p>{data.data.username}</p>
              </div>
              <div>
                <p>
                  {data.data.review}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
