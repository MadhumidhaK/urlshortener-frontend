import React, { useState, useEffect } from 'react';
import { Button, ModalFooter, Modal, ModalHeader, ModalBody, Label, Input, ButtonGroup } from 'reactstrap';
import { useRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';
import { filterStateRecoil } from '../../sharedStates/filterState';
import { userURLsRecoil } from '../../sharedStates/userURLs';
import moment from "moment";
import { useFetch } from '../../hooks/useFetch';
import { url } from '../../utils/apiURL';
import { authenticationStateRecoil } from '../../sharedStates/authenticationState';
import { displayingURLsRecoil } from '../../sharedStates/displayingURLs';

const Filter = () => {
    const authenticationState = useRecoilValue(authenticationStateRecoil);
    const [filterState, setFilterState] = useRecoilState(filterStateRecoil);
    const userURLs  = useRecoilValue(userURLsRecoil);
    const [displayingURLs, setDisplayingURLs] = useRecoilState(displayingURLsRecoil);
    const dateFormatter = (item) => moment(item).format("MMM DD");
    const [URLsError, setURLsError ] = useState({
        error: ""
    });
    const [filterDate, setFilterDate] = useState(null);
    
    const toggle = () => {
        setFilterState({
            ...filterState,
            isFilterModalOpen: false
        })
    }

    useEffect(() => {
        if(!filterState.isFiltered){
            setDisplayingURLs([...userURLs]);
        }
    }, [filterState])

    const userURLsSuccesCB = (response) => {
        console.log(response)
        setDisplayingURLs(response.userUrls);
    }

    const userURLsErrorCB = (response) => {
        console.log("error occured")
        console.log(response);
        setURLsError({
            error: response.error
        })
    }
    let responseStatusCode;
    const getFilteredUrls = async (endPoint, filterString) => {
        try{
            setFilterState({
                ...filterState,
                isFilterModalOpen: false,
                isFiltered: true,
                filter: filterString
            })
            console.log("endPoint")
            console.log(endPoint)
            const res = await  fetch(endPoint, {
                        method: "GET",
                        headers: {
                            "Authorization": authenticationState.token
                        },
                        credentials: 'include'
                                });
            responseStatusCode = res.status;
            const resJson = await res.json();
            if(responseStatusCode === 200){
                return  userURLsSuccesCB(resJson)
            }
            else{
                return userURLsErrorCB(resJson)
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <>  
            <Modal isOpen={filterState.isFilterModalOpen} toggle={toggle}>
                <ModalHeader toggle={toggle} className="bg-light">Modal title</ModalHeader>
                    <ModalBody  className="bg-light">
                        
                    <div className="d-flex justify-content-around">
                    Filter By Last:
                        <ButtonGroup>
                            <Button color="warning" onClick={() => {
                                const date= new Date ()
                                getFilteredUrls(url + "/url/date/"+ date.toISOString(), "Today");
                            }}  size="sm">Day</Button>
                            <Button color="warning" onClick={() => {
                                getFilteredUrls(url + "/url/lastweek", "Week");
                            }} size="sm">Week</Button> 
                            <Button color="warning" onClick={() => {
                                getFilteredUrls(url + "/url/lastmonth", "Month");
                            }} size="sm">Month</Button> 
                        </ButtonGroup>
                    </div>
                            <Label for="exampleDate">Date</Label>
                            <Input
                            type="date"
                            name="date"
                           value={filterDate}
                            onChange={(e) => {
                                setFilterDate(e.target.value)
                            }}
                            id="date-filter"
                            placeholder="date placeholder"
                            />
                        <Button size="sm" color="info" className="float-right m-2" onClick={() => {
                                const date = new Date(filterDate);
                                const now = new Date();
                                
                                const filterString = (date.getDate() === now.getDate() && 
                                    date.getMonth() === now.getMonth() && 
                                    date.getFullYear() === now.getFullYear()) ? "Today" : dateFormatter(date); 
                                getFilteredUrls(url + "/url/date/"+ date.toISOString(), filterString );
                            }}>Apply</Button>
                    </ModalBody>
            </Modal>
            
        </>
    )
} 

export default Filter;