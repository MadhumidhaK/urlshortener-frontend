import "./URLsList.css"
import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { useRecoilValue, useRecoilState } from 'recoil';
import { NavLink } from "react-router-dom";
import moment from "moment";
import { url } from '../../utils/apiURL';
import { displayingURLsRecoil } from "../../sharedStates/displayingURLs";
import { responsiveRecoil } from "../../sharedStates/responsive";


const URLsList = () => {
    const displayingURLs = useRecoilValue(displayingURLsRecoil);
    const dateFormatter = (item) => moment(item).format("DD MMM");
    const [responsive, setResponsive] = useRecoilState(responsiveRecoil);

    const linksCount= displayingURLs.length;
    
    return (
        <ListGroup className="overflow-auto list">
            <ListGroupItem className="text-center li-head">{ linksCount + (linksCount === 1 ? " Link" : " Links")}</ListGroupItem>
            { displayingURLs.map((u, i) => {
                return (
                    <NavLink key={i} to={"/" + u.shortUrl} onClick={() => {
                            if(responsive.isMobile){
                                setResponsive({
                                    ...responsive,
                                    mobile: {
                                        isURLDetailOpen: true
                                    }
                                })
                            }
                    }}>
                        <ListGroupItem>
                            <p className="text-secondary small text-truncate">{dateFormatter(u.createdAt).toUpperCase()}</p>
                            <p className="text-dark text-truncate">{u.name ? u.name : u.longUrl}</p>
                            <div className="d-flex justify-content-between align-items-center flex-nowrap">
                                <p className="text-danger text-truncate">{ url +  "/" + u.shortUrl}</p>
                                <p className="text-secondary small">{u.clicks.length + (u.clicks.length === 1 ? " Click" : " Clicks")}</p>
                            </div>
                        </ListGroupItem>
                    </NavLink>
                )
            })}
        </ListGroup>
    )
}

export default URLsList;