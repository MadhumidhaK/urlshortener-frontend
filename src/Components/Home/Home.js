import "./Home.css"
import React, { useState, useEffect }  from 'react';
import { Button, Alert, Row, Col, Container,  Collapse, CardBody, Card, Input, Label, ButtonGroup, Spinner, UncontrolledTooltip } from 'reactstrap';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import URLForm from '../URLForm/URLForm';
import { userURLsRecoil } from '../../sharedStates/userURLs';
import { useFetch } from '../../hooks/useFetch';
import { authenticationStateRecoil } from '../../sharedStates/authenticationState';
import { url }   from '../../utils/apiURL';
import { chartStateRecoil } from '../../sharedStates/chartState';
import Chart from '../Chart/Chart';
import URLsList from "../URLsList/URLsList";
import URLDetail from "../URLDetail/URLDetail";
import { BrowserRouter as Router } from "react-router-dom";
import { filterStateRecoil } from "../../sharedStates/filterState";
import Filter from "../Filter/Filter";
import { responsiveRecoil } from "../../sharedStates/responsive";

const Home = function(){
    const [authenticationState, setAuthenticationState] = useRecoilState(authenticationStateRecoil);
    const [chartState, setChartState] = useRecoilState(chartStateRecoil);
    const [filterState, setFilterState] = useRecoilState(filterStateRecoil);
    const resetFilter = useResetRecoilState(filterStateRecoil);
    const [responsive, setResponsive] = useRecoilState(responsiveRecoil);
    const [userURLs, setUserURLs]  = useRecoilState(userURLsRecoil);


    

  const verifyToken = async () => { 
    try{
        const storedToken = window.localStorage.getItem('auth-token');
        const res = await fetch( url + "/user/verifytoken", {
                                    method: "GET",
                                    headers:{
                                        'Authorization': storedToken
                                    },
                                    credentials: 'include',
                                });
        const { isLoggedIn } =await res.json();

        if(isLoggedIn ){
            setAuthenticationState({
                isAuthenticated: true,
                token: storedToken
            })
        }else{
            setAuthenticationState({
                isAuthenticated: false,
                token: undefined
            })
        }
    }catch(err){
        console.log(err)
    }
}
    useEffect(function(){
        verifyToken();
    }, [])

    const [counts, setCounts] = useState({
        clicksCount: 0,
        urlCount: 0
    })
    const [isResizing, setIsResizing ]= useState(false);
    window.addEventListener('resize', () => {
        setIsResizing(window.innerWidth)
    });
   
    useEffect(() => {
            if(window.innerWidth < 768){
                setResponsive({
                    ...responsive,
                    isMobile: true
                })
            }else{
                setResponsive({
                    isMobile: false,
                    mobile: {
                        isURLDetailOpen: false
                    }
                })
            }
        
    }, [isResizing])
    const [userURLsError, setUserURLsError ] = useState({
        error: ""
    });
    
    const userURLsSuccesCB = (response) => {
        setUserURLs(response.userUrls);

        
    }

    const userURLsErrorCB = (response) => {
        console.log("error occured")
        console.log(response);
        setUserURLsError({
            error: response.error
        })
    }

    const { response, responseStatusCode, error, isLoading } = useFetch(url + "/url/all", {
        method: "GET",
        headers: {
            "Authorization": authenticationState.token
        },
        credentials: 'include'
    }, userURLsSuccesCB, userURLsErrorCB);

    
    useEffect(() => {
        const clicksCount  = userURLs.reduce((clicksCount, userURL) => {
            return clicksCount + userURL.clicks.length
        }, 0);
        const urlCount = userURLs.length;
        setCounts({
           clicksCount: clicksCount,
           urlCount: urlCount
        });

        const count = userURLs.length;
        if(count > 0 ){
        let i = 0;
        let data = [];
        const today = new Date();
        const startDay = new Date();
        startDay.setDate(today.getDate() - 32);
        let d = startDay;
        while(d <= today){
            let date = new Date(d).toISOString();
            data.push({ 
                date: date,
                count: 0,
                urls: []
            });
            
            d.setDate(d.getDate() + 1);
        }
        while(i < count){
            const index = 32  - (Math.round((new Date() - new Date(userURLs[i].createdAt)) / (1000 * 60 * 60 * 24)));

            if(index >= 0){
                data = data.map((d, j) => {
                            if(j !== index){
                                return d;
                            }
                            return {
                                ...d,
                                count: d.count + 1,
                                urls: [...d.urls, userURLs[i] ]
                            }
                        })
            }
            i++;   
        }
        setChartState({
            ...chartState,
            data
        });
    }
    }, [userURLs]);

   


    if(userURLsError.error){
         return (
            <div>
                <Row>
                <Col md={5} className="bg-light mx-auto mt-3 p-3">
              <Alert color="danger">
                <h4 className="alert-heading">Some error occured!</h4>
                <p>
                  Please refresh your page or try again later.
                </p>
                <hr />
                <p className="mb-0">
                  If the issue is not resolved please contact out customer support <b> 0038481099 </b>
                </p>
              </Alert>
              </Col>
              </Row>
            </div>
          );
    }

    if(isLoading){
        return (
            <div className="w-100 text-center">
                <Spinner color="info" className="page-spin"></Spinner>
            </div>
        )
    }
    return(
        <div>
        <div className="bg-blue p-2">
        { filterState.isFiltered ? 
            <ButtonGroup>
                <Button onClick={() => {
                    setFilterState({
                        ...filterState,
                        isFilterModalOpen: true
                    })
                }}>{filterState.filter}</Button>
                <Button id="clearFilter" onClick={() => {
                        resetFilter();
                }}>x</Button>
                <UncontrolledTooltip placement="right" target="clearFilter">
                    Clear filter
                </UncontrolledTooltip>
            </ButtonGroup>
        : 
                <Button onClick={() => {
                    setFilterState({
                        ...filterState,
                        isFilterModalOpen: true
                    })
                }}>Select Date</Button>
        }
        </div>
        <div className="text-center bg-blue">
        <div>
        <Collapse isOpen={chartState.isOpen}>
            <Card className="bg-blue">
            <CardBody className="p-1">
                <Container fluid className="p-0">
                <Row className="m-0">
                    <Col md="2" className="p-0">
                    <div>
                        <p>Total Clicks : <span>{counts.clicksCount}</span></p>
                        <p>Total Links : <span>{counts.urlCount}</span></p>
                    </div>
                    </Col>
                    <Col md="10" className="p-0">
                    <div className="mr-4">
                        <Chart />
                    </div>
                    </Col>
                </Row>
                </Container>
            </CardBody>
            </Card>
        </Collapse>
        </div>
        </div>
        <div className="text-center">
        <Button size="sm" className="mx-auto chart-btn bg-blue" onClick={() => {
            setChartState({
                ...chartState,
                isOpen: !chartState.isOpen
            })
        }}>{chartState.isOpen ? "Hide Chart" : "Show Chart"}</Button>
        </div>
        <URLForm />
        <Filter />
        <Router>
            {responsive.isMobile && (
                <>
                    {
                        responsive.mobile.isURLDetailOpen ? 
                        (        
                                <>
                                
                                <Button size="sm" className="float-right mr-3" close onClick={() => {
                                    return setResponsive({
                                        ...responsive,
                                        mobile: {
                                           isURLDetailOpen: false
                                        }
                                    })
                                }}></Button>
                                <URLDetail />
                                </>
                        ) :
                        
                        <URLsList />
                    }
                </>
            )}
        
        { !responsive.isMobile && (
            <Container fluid={true}>
                <Row>
                    <Col md="5" className="border-right">
                        <URLsList />
                    </Col>
                    <Col md="7">
                    <URLDetail />
                    </Col>
                </Row>
            </Container>
        )}
        </Router>
        </div>
    )
}

export default Home;