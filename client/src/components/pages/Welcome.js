import React from "react";

function Welcome() {
  return (
    <div>
      <div className="row">
        <div
          className="col s12 m7"
          style={{
            marginLeft: 300,
            marginTop: 100,
          }}
        >
          <div className="card">
            <div
              className="card-content"
              style={{
                background: "#00897b ",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Roboto Slab serif",
                  letterSpacing: 5,
                }}
              >
                Apple House Community
              </h2>

              <div
                className="centered-container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  className="logo"
                  src="\logo.jpg"
                  alt="Logo"
                  style={{
                    borderRadius: "50px",
                  }}
                />
              </div>

              <div>
                <p
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: "20px",
                    marginTop: "20px",
                  }}
                >
                  Find answers. Ask questions. Connect with Apple customers
                  around the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
