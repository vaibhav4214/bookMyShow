import { useState } from "react"
import { movies, slots, seats } from "./Data"
import Button from '@mui/material/Button';
import { useEffect } from "react";  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BallTriangle } from 'react-loader-spinner'



const Booking = () => {
    const moviesName = movies
    const [loader, setLoader] = useState(false)
    const [loader2,setLoader2]=useState(true)
    const slotsTime = slots
    const selectSeats = seats
    const [count, setcount] = useState(0)
    const [lastBooking,setLastBooking]=useState("")
    const [moviePreviousData, setMoviePreviousData] = useState([0])
    let selectedDataVal = JSON.parse(localStorage.getItem('selectedData')) ? JSON.parse(localStorage.getItem('selectedData')) : {
        selectedMovie: "",
        timeSlot: "",
        A1: "0",
        A2: "0",
        A3: "0",
        A4: "0",
        D1: "0",
        D2: "0",
    }


    // fetch data first
    const fetchData = async () => {
        await fetch("http://localhost:8080/api/allData").then((res) => {
            console.log(res)
            return res.json()
        }).then((res) => {
            setMoviePreviousData(res)
        })
    }

    const LastBookingDetails=async()=>
    {
        await fetch("http://localhost:8080/api/lastBookingDetails").then((res) => {
            
            return res.json()
        }).then((res) => {
            setLastBooking(res)
            console.log("sd"+res)
            setLoader2(false)
      


        })
    }
    
    useEffect(() => {

         fetchData()
         LastBookingDetails()
        

    }, [count])



    // movie select

    const movieSelect = (e) => {

        const val = e.target.value
        console.log(val)


        selectedDataVal = {
            ...selectedDataVal,
            selectedMovie: val
        }
        document.querySelector("#movieError").innerHTML = ""
        localStorage.setItem('selectedData', JSON.stringify(selectedDataVal));
        setcount(count + 1)

    }
    // time slot
    const slotTimeSelect = (e) => {

        const val = e.target.value
        console.log(val)


        selectedDataVal = {
            ...selectedDataVal,
            timeSlot: val
        }
        document.querySelector("#slotTimeError").innerHTML = ""
        localStorage.setItem('selectedData', JSON.stringify(selectedDataVal));

        setcount(count + 1)

    }

    // ticket quantity
    const ticketQuantity = (e) => {
        const val = e.target.value
        const name = e.target.name


        selectedDataVal = {
            ...selectedDataVal,
            [name]: val
        }
        document.querySelector("#quantityError").innerHTML = ""
        localStorage.setItem('selectedData', JSON.stringify(selectedDataVal));
        setcount(count + 1)



    }
    const getForm = async (event) => {

        event.preventDefault();


        if (event.target.name === "submitBtn") {

            {
                if (!selectedDataVal.selectedMovie) {
                    document.querySelector("#movieError").innerHTML = "Plz Select Movie"
                }
                else if (!selectedDataVal.timeSlot) {
                    document.querySelector("#slotTimeError").innerHTML = "Plz Select Time"
                }


                else if ((selectedDataVal.A1 == "0" && selectedDataVal.A2 == "0" && selectedDataVal.A3 == "0" && selectedDataVal.A4 == "0" && selectedDataVal.D1 == "0" && selectedDataVal.D2 == "0")) {
                    document.querySelector("#quantityError").innerHTML = "Plz Select Ticket"
                }
                else {

                    selectedDataVal = {
                        ...selectedDataVal,
                        id: event.target.value
                    }
                    setLoader(true)
                    await fetch("http://localhost:8080/api/booking", {
                        method: "POST",
                        body: JSON.stringify(selectedDataVal),
                        headers: {
                            'Content-Type': 'application/json'
                        }

                    })
                    setLoader(false)

                    let blankData=JSON.parse(localStorage.getItem('selectedData'))
                    blankData={
                        selectedMovie: "",
                        timeSlot: "",
                        A1: 0,
                        A2: 0,
                        A3: 0,
                        A4: 0,
                        D1: 0,
                        D2: 0,

                    }
                    localStorage.setItem('selectedData', JSON.stringify(blankData));
                    setcount(count+1)
                    
                    toast.success('Ticket Booked', {
                        position: "top-center",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        });

                }
            }

        }







    }

    // remove relode form
    return (<>   {loader2 ? <div className=" w-[200px] mt-[10%] mx-auto my-auto"><BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperClass={{}}
        wrapperStyle=""
        visible={true}
      /></div> :   <div className="grid grid-cols-12 mt-[50px]">
        <div className="col-span-12 lg:col-span-3"></div>

        {/* information div */}
        <div className="w-[100%] col-span-12 lg:col-span-6 mx-auto mt-[20px]">
            {/* movie section */}
            <form onClick={getForm} method="post">
                <div className="border-[1px] p-[30px] border-[black] rounded-[7px]">
                    <p className="mb-[15px] font-[800]">Select A Movie</p>
                    {
                        moviesName.map((e, i) => {
                            return <button onClick={movieSelect} value={e} className={selectedDataVal.selectedMovie === e ? "p-[10px] bg-[#c5751a] mb-[5px] mx-[2px] inline cursor-pointer rounded-[5px] border-[1px] border-[black]" : "p-[10px]  mb-[5px] mx-[2px] inline cursor-pointer rounded-[5px] border-[1px] border-[black]"} >{e}</button>
                        })
                    }
                    <p id="movieError" className="text-[red]"></p>

                </div>

                {/* Time Slot Section */}
                <div className="border-[1px] mt-[10px] p-[30px] border-[black] rounded-[7px]">
                    <p className="mb-[15px] font-[800]">Select A Time Slot</p>
                    {
                        slotsTime.map((e, i) => {
                            return <button onClick={slotTimeSelect} value={e} className={selectedDataVal.timeSlot === e ? "p-[10px] bg-[#c5751a] mb-[5px] mx-[2px] inline cursor-pointer rounded-[5px] border-[1px] border-[black]" : "p-[10px]  mb-[5px] mx-[2px] inline cursor-pointer rounded-[5px] border-[1px] border-[black]"} >{e}</button>
                        })
                    }
                    <p id="slotTimeError" className="text-[red]"></p>
                </div>

                {/* Select Seat */}
                <div className="border-[1px] mt-[10px] p-[30px] border-[black] rounded-[7px]">
                    <p className="mb-[15px] font-[800] ">Select Seats</p>
                    {
                        selectSeats.map((e, i) => {
                            return <div className={parseInt(selectedDataVal[e]) > 0 ? "inline-block cursor-pointer text-center w-[100px] p-[5px] border-[1px] m-[5px] rounded-[5px] border-[black] h-[70px] bg-[#c5751a]" : "inline-block cursor-pointer text-center w-[100px] p-[5px] border-[1px] m-[5px] rounded-[5px] border-[black] h-[70px]"} >
                                <p className="">{e}</p>

                                <input type="number" max="10" name={e} onChange={ticketQuantity} value={selectedDataVal[e] ? parseInt(selectedDataVal[e]) : 0} min="0" className="border-[1px] text-center  border-[#3d3a3acb] w-[80%] rounded-[5px]" />
                            </div>
                        })
                    }
                    <p id="quantityError" className="text-[red]"></p>

                </div>
                {loader ? <button disabled type="button" class="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
                    <svg aria-hidden="true" role="status" class="inline mt-[5px] w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                    </svg>
                    Loading...
                </button> : <Button variant="contained" value={moviePreviousData[0]._id} type="submit" name="submitBtn" sx={{ marginTop: 2 }} color="success">Book Now</Button>}

            </form>


        </div>
        {/* histori div */}
        <div className="col-span-12 lg:col-span-3">
            {/* last Booking Details */}
            
            <div className="p-[10px] border-[1px] rounded-[7px] border-[black] mt-[20px] mx-[20px]" >
                    <p className="font-[700] text-[20px]">Last Booking Details</p>
                    {lastBooking.selectedMovie ?  <ul>
                                    <li><b>Seats:</b></li>
                                    <li><b>A1: </b>{lastBooking.A1}</li>
                                    <li><b>A2: </b>{lastBooking.A2}</li>
                                    <li><b>A3: </b>{lastBooking.A3}</li>
                                    <li><b>A4: </b>{lastBooking.A4}</li>
                                    <li><b>D1: </b>{lastBooking.D1}</li>
                                    <li><b>D2: </b>{lastBooking.D2}</li>
                                    <li><b>Time Slot: </b>{lastBooking.timeSlot}</li>
                                    <li><b>Movie: </b> {lastBooking.selectedMovie}</li>
                    </ul> : <p className="text-[red]">{lastBooking}</p> }
                   
            </div>
        </div>
        <ToastContainer />
    </div>
}
    </>)
}

export default Booking