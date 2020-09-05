import "./URLDetail.css"
import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userURLsRecoil } from '../../sharedStates/userURLs';
import { Switch, Route, Redirect } from 'react-router-dom';
import moment from "moment";
import { Row, Col, Button, Tooltip as Tip } from 'reactstrap';
import { url } from '../../utils/apiURL';
import { ResponsiveContainer, BarChart,  XAxis, YAxis, Bar,  Tooltip } from 'recharts';
import { urlFormStateRecoil } from "../../sharedStates/urlFormState";
import { displayingURLsRecoil } from "../../sharedStates/displayingURLs";

const URLDetail = () => {
    const  displayingURLs   = useRecoilValue(displayingURLsRecoil);
    const dateFormatter = (item) => moment(item).format("MMM DD, HH:MM A ");
    const setUrlFormState = useSetRecoilState(urlFormStateRecoil);
    const [isCopiedTip, setIsCopiedTip] = useState({
        isOpen: false,
        text: ""
    });
    useEffect(() => {
        if(isCopiedTip.isOpen){
            setTimeout(() => {
                setIsCopiedTip({
                    isOpen: false,
                    text: ""
                })
            }, 3000)
        }
    }, [isCopiedTip])
    return (
        <div>
            <Switch>
                {displayingURLs.map((u,i) => {
                    const count = u.clicks.length;
                    let data = [];
                    const today = new Date();
                    const startDay = new Date();
                    startDay.setDate(today.getDate() - 32);
                    let d = startDay;
                    while(d <= today){
                        let date = new Date(d).toISOString();
                        data.push({ 
                            date: date,
                            count: 0
                        });
                        
                        d.setDate(d.getDate() + 1);
                    }
                    let clickIndex = 0;
                    
                    while(clickIndex < count){
                        const index = 32  - (Math.round((new Date() - new Date(u.clicks[clickIndex].clickedTime)) / (1000 * 60 * 60 * 24)));
                        if(index >= 0){
                            data = data.map((d, j) => {
                                        if(j !== index){
                                            return d;
                                        }
                                        return {
                                            ...d,
                                            count: d.count + 1
                                        }
                                    })
                        }
                        clickIndex++;   
                    }

                    const openUrLForm = ()=> {
                        setUrlFormState({
                            isOpen: true,
                            createURL: false,
                            longUrl: u.longUrl,
                            shortUrl: u.shortUrl,
                            name: u.name,
                            alreadyExistsError: false
                        })
                    }

                    const copyShortURL = async () => {
                            try{
                                   const copied = await navigator.clipboard.writeText(url +  "/" + u.shortUrl);
                                   console.log(copied)
                                    setIsCopiedTip({
                                        isOpen: true,
                                        text: "Copied!"
                                    })
                            }catch(error){
                                    console.log(error);
                                    setIsCopiedTip({
                                        isOpen: true,
                                        text: "Unable to copy!"
                                    })
                            }
                    }
                   return (<Route key={i} sensitive exact path={"/" + u.shortUrl}>
                       <Row className="m-0">
                            <Col md='12'>
                                <p className="small text-secondary">Created at {dateFormatter(u.createdAt)}</p>
                                <h4 className="text-break">{u.name ? u.name : u.longUrl}</h4>
                                <a href={u.longUrl} target="_blank" className="d-block text-break small text-secondary">{u.longUrl}</a>
                                <br />
                                <div className="d-flex align-items-center">
                                    <a href={ url +  "/" + u.shortUrl} className="text-danger text-break" target="_blank">{ url +  "/" + u.shortUrl}</a>
                                    <Button size="sm" className="ml-2 px-2 py-0 short-url-btn" outline onClick={openUrLForm}>Edit</Button>
                                    <Button size="sm" className="ml-2 px-2 py-0 copy-btn" id="copy" color="info" outline onClick={() => {
                                        copyShortURL();
                                    }}>Copy</Button>
                                    <Tip placement="top" isOpen={isCopiedTip.isOpen} target="copy">
                                        {isCopiedTip.text}
                                    </Tip>
                                </div>
                                <div className="d-flex justify-content-center align-items-center flex-wrap">
                                <p>Total Clicks: {u.clicks.length}</p>
                                {u.clicks.length > 0 && <ResponsiveContainer width="80%" height={250}>
                                    <BarChart width={850} height={250} data={data}>
                                        
                                        <XAxis dataKey={"date"} tickFormatter={(x) => {
                                           return moment(x).format("MMM DD");
                                        }} />
                                        <YAxis dataKey="count" tick={false} axisLine={false} />
                                        <Tooltip labelFormatter={(x) => {
                                           return moment(x).format("DD MMM");
                                        }}/>
                                        <Bar dataKey="count" fill="green" />
                                    </BarChart>
                                </ResponsiveContainer>}
                                </div>
                            </Col>
                        </Row>
                    </Route>)
                } )}
                <Route path="/"><Redirect to={"/"} /></Route>
            </Switch>
        </div>
    )

    
}

export default URLDetail;