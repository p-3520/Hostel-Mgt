import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import noteContext from "../context/noteContext";

import { Dismiss } from "flowbite";
let varia = 1;
let rott = 360;
export const Admincomplains = () => {
  const { state, dispatch } = useContext(noteContext);
  console.log(state);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      initializePage();
      getallcomps();
    } else {
      dispatch({ type: "UPDATE_AVALUE", payload: false }); // Ensures adminsidebar is off if not logged in
      navigate("/adminsignin");
    }
  }, []);
  function initializePage() {
    if (!state.adminsidebar) {
      dispatch({ type: "UPDATE_AVALUE", payload: true });
    }
  }
  function dothis() {
    dispatch({ type: "UPDATE_VALUE", payload: false });
    dispatch({ type: "UPDATE_AVALUE", payload: true });
  }

  const [submitresponse, setsubmitresponse] = useState("");
  const [newds, setnewds] = useState();

  function dothis() {
    dispatch({ type: "UPDATE_VALUE", payload: true });
    dispatch({ type: "UPDATE_AVALUE", payload: false });
  }
  let bodykadata = [];
  const getallcomps = async (e) => {
    const response = await fetch(
      `http://${state.backend}:${state.port}/api/c/complains`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    let json = await response.json();
    function convertTZ(date, tzString) {
      return new Date(
        (typeof date === "string" ? new Date(date) : date).toLocaleString(
          "en-US",
          { timeZone: tzString }
        )
      );
    }
    let elly = document.getElementById("tbody");

    for (let i = parseInt(json.history_lenght) - 1; i >= 0; i--) {
      let cdate = convertTZ(json.allcomps[i].date, "Asia/Kolkata").toString();
      let g1 = cdate.slice(4, 15);
      let ccatagory = json.allcomps[i].catagory;
      let cdescription = json.allcomps[i].description;
      let dessignal = true;
      if (parseInt(cdescription.length) > 50) {
        dessignal = false;
      }
      let cstatus = json.allcomps[i].status;
      let mid = `mid${i}`;
      let did = `d${json.allcomps[i]._id}`;
      let delclose = `delclose${json.allcomps[i]._id}`;
      let smid = `smid${i}`;
      let hmid = `#mid${i}`;
      const name = json.allcomps[i].name;

      bodykadata.push(
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {g1}
          </th>
          <td className="px-6 py-4">{name}</td>
          <td className="px-6 py-4">{ccatagory}</td>
          <td className="px-6 py-4">
            {dessignal ? cdescription : cdescription.slice(0, 46) + "...."}
          </td>
          <td
            className={
              cstatus === "Pending"
                ? "px-6 py-4 whitespace-nowrap yelpending"
                : cstatus === "Solved"
                ? " px-6 py-4 whitespace-nowrap solgreen"
                : "px-6 py-4 whitespace-nowrap"
            }
          >
            {cstatus}
          </td>

          <td className="px-6 py-4 d-flex">
            <button
              className="pview"
              data-bs-toggle="modal"
              data-bs-target={hmid}
            >
              View
            </button>
          </td>
          <td>
            <div
              className="modal fade"
              id={mid}
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5">Problem</h1>
                    <button
                      className="btn-close"
                      id={delclose}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">{cdescription}</div>
                  <div className="modal-footer">
                    <button
                      className={
                        cstatus === "Solved"
                          ? "focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 m-2 divdisable"
                          : "focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 m-2"
                      }
                      id={json.allcomps[i]._id}
                      onClick={solvedreq}
                    >
                      Solved
                    </button>
                    <button
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 m-2"
                      id={did}
                      onClick={deletereq}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    }
    setnewds([...bodykadata.slice(0, Math.ceil(bodykadata.length / 2))]);
  };

  const handle = async (e) => {
    let descc = document.getElementById("descc").value;
    let Catagoryid = document.getElementById("Catagoryid").value;

    e.preventDefault();
    if (Catagoryid === "null") {
      document.getElementById("Catagoryid").classList.add("laalc");
      console.log("first");
      setTimeout(function () {
        console.log("first");
        document.getElementById("Catagoryid").classList.remove("laalc");
      }, 3000);
    } else {
      const response = await fetch(
        `http://${state.backend}:${state.port}/api/c/newcomplain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ description: descc, catagory: Catagoryid }),
        }
      );
      let json = await response.json();

      if (json.response) {
        getallcomps();
        setsubmitresponse(
          <div
            class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
            id="csubmittedalert"
          >
            <span class="font-medium">Success !</span> Your complain has been
            submitted successfully and we will get back to you as soon as we
            can.
          </div>
        );
      } else {
        getallcomps();
        setsubmitresponse(
          <div
            class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span class="font-medium">Error!</span> Some error Occured.
          </div>
        );
      }
    }
  };
  const plusclicked = () => {
    setsubmitresponse("");
  };

  const reloadhistory = async (e) => {
    console.log("not hapeening");
    let elly = document.getElementById("tero");

    elly.style.transform = `rotate(${rott}deg)`;
    rott = rott + 360;
    const tempv = await getallcomps();
  };

  const solvedreq = async (e) => {
    console.log(e.target.id);

    const response = await fetch(
      `http://${state.backend}:${state.port}/api/c/newcomplain`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: e.target.id }),
      }
    );
    let json = await response.json();
    console.log(json);

    if (json.response) {
      toastshowing(1);
      document.getElementById("refdiv").click();
      // document.getElementById(e.target.id).classList.add('divdisable')
    } else {
      toastshowing(0);
    }
  };
  const deletereq = async (e) => {
    const dide = e.target.id;
    let delid = dide.slice(1);
    document.getElementById(`delclose${delid}`).click();
    const response = await fetch(
      `http://${state.backend}:${state.port}/api/c/newcomplain`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: delid }),
      }
    );
    let json = await response.json();
    console.log(json);
    if (json.response) {
      // document.getElementById(dide).classList.add('divdisable')
      deltoastshowing(1);
      document.getElementById("refdiv").click();
    } else {
      deltoastshowing(0);
    }
  };

  const toastshowing = (val) => {
    const targetEl = document.getElementById("toast-success");
    if (parseInt(val) == 0) {
      const targetEl = document.getElementById("toast-fail");
    }

    targetEl.classList.remove("hidden");
    targetEl.classList.remove("opacity-0");

    setTimeout(function () {
      toastdismiss();
    }, 5000);
  };
  const toastdismiss = () => {
    const $targetEl = document.getElementById("toast-success");
    const dismiss = new Dismiss($targetEl);
    dismiss.hide();
  };
  const deltoastshowing = (val) => {
    const targetEl = document.getElementById("deltoast-success");
    if (parseInt(val) == 0) {
      const targetEl = document.getElementById("toast-fail");
    }

    targetEl.classList.remove("hidden");
    targetEl.classList.remove("opacity-0");

    setTimeout(function () {
      deltoastdismiss();
    }, 5000);
  };

  const deltoastdismiss = () => {
    const $targetEl = document.getElementById("deltoast-success");
    const dismiss = new Dismiss($targetEl);
    dismiss.hide();
  };

  return (
    <>
      <div className="downward">
        <div className="one two fourth justify-content-center calcby">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border h100 p-4">
            <div
              className="relative overflow-x-auto sm:rounded-lg"
              style={{ maxHeight: "400px" }}
            >
              <div className="reloadhistorydiv">
                <p className="p-2 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                  Complains
                </p>
                <div className="sbTnsdiv">
                  <button
                    className="text-black bg-gray-100 hover:bg-gray-200  focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:focus:ring-gray-500"
                    id="addcompid"
                    onClick={plusclicked}
                    data-bs-toggle="modal"
                    data-bs-target="#addnewcompform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus-lg"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                      />
                    </svg>
                  </button>
                  <button
                    className="text-black bg-gray-100 hover:bg-gray-200  focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:focus:ring-gray-500"
                    id="refdiv"
                    onClick={reloadhistory}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-clockwise trotate"
                      id="tero"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                      />
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                    </svg>
                  </button>
                </div>
              </div>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Catagory
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody id="tbody">
                  {bodykadata}
                  {newds}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
