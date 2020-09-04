import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormText, Alert } from 'reactstrap';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { urlFormStateRecoil } from "../../sharedStates/urlFormState";
import { useForm } from "../../hooks/useForm";
import { url } from "../../utils/apiURL";
import { authenticationStateRecoil } from "../../sharedStates/authenticationState";
import { userURLsRecoil } from "../../sharedStates/userURLs";
import { toastStateRecoil } from "../../sharedStates/toastState";
import { filterStateRecoil } from "../../sharedStates/filterState";
import { displayingURLsRecoil } from "../../sharedStates/displayingURLs";


const URLForm = function() {
    const [urlFormState, setUrlFormState] = useRecoilState(urlFormStateRecoil);
    const resetURLForm = useResetRecoilState(urlFormStateRecoil)
    const authenticationState = useRecoilValue(authenticationStateRecoil);
    const filterState = useRecoilValue(filterStateRecoil);
    const [displayingURLs, setDisplayingURLs] = useRecoilState(displayingURLsRecoil);

    const [addName, setAddName] = useState(false);
    const [userURLs, setUserURLs]  = useRecoilState(userURLsRecoil);
    const [toastState, setToastState] = useRecoilState(toastStateRecoil)
    const toggle = () => {
        resetURLForm();
        setValues({
            longUrl: "",
            name: ""     
        })
        setAddName(false);
    };
    let initialValues = {
        longUrl: "",
        name: ""
    }  
    useEffect(() => {
        console.log(urlFormState)
        if(urlFormState.createURL){
            setValues({
                longUrl: urlFormState.longUrl,
                name: urlFormState.name
            })
        }else{
            if(urlFormState.name){
                setAddName(true)
            }
           setValues({
            longUrl: urlFormState.longUrl,
            name: urlFormState.name,
            shortUrl: urlFormState.shortUrl
        })
        }
    }, [urlFormState]);
     

    useEffect(() => {
        if(!filterState.isFiltered){
            setDisplayingURLs(userURLs); 
        }
     },[userURLs])
    
    

    const validate = (changedObject) => {
        const errors = {}
        if(changedObject.param === "longUrl"){
            if(!changedObject.value){
                errors.longUrl = "Please enter an URL";
            }
            if(changedObject.value){
                errors.longUrl = "";
            }
        }
        return errors;
    }

    const sucessCB = (response) => {
        if(urlFormState.createURL){
            console.log(response)
            setUserURLs([...userURLs, response.newURL]);
            if(filterState.isFiltered && filterState.filter === "Today" || filterState.filter === "Week" || filterState.filter === "Month" ){
                setDisplayingURLs([...displayingURLs, response.newURL])   
            }
            setToastState({
                isOpen: true,
                toastBody: "Your short URL is " + url + "/"+ response.newURL.shortUrl,
                toastHeader: "Your short URL has been created!",
                className: "bg-success"
            })
        }else{
            setDisplayingURLs(displayingURLs.map((u,i) => {
                if(u.shortUrl === response.shortUrl){
                    return {
                        ...response
                    }
                }
                return u;
            }))

            setUserURLs(userURLs.map((u,i) => {
                if(u.shortUrl === response.shortUrl){
                    return {
                        ...response
                    }
                }
                return u;
            }))
            setToastState({
                isOpen: true,
                toastBody: "Your name is updated.",
                toastHeader: "Updated!",
                className: "bg-success"
            })
        }

        resetURLForm();
        setValues({
            longUrl: "",
            name: ""     
        })
        setAddName(false);
    }

    
    const errorCB = (response, responseStatusCode) => {
        if(responseStatusCode === 422){
            return;
        }
        if(responseStatusCode === 409){
            setUrlFormState({
                isOpen: true,
                createURL: false,
                longUrl: response.data.longUrl,
                shortUrl: response.data.shortUrl,
                name: response.data.name,
                alreadyExistsError: true
            })

            setValues({
                longUrl: response.data.longUrl,
                shortUrl: response.data.shortUrl,
                name: response.data.name
            })
            if(response.data.name){
                setAddName(true)
            }
        }

    }

    const { handleChange, handleSubmit, values, setValues, response, responseStatusCode ,errors } = useForm(initialValues, validate, sucessCB, errorCB)

    return (
        <Modal isOpen={urlFormState.isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{urlFormState.createURL ? "Create Link" : "Edit Link"}</ModalHeader>
        <ModalBody>
                {urlFormState.createURL ? 
                    (
                        <>
                            <Label for="longUrl">Long URL</Label>
                            <Input 
                                type="text" 
                                name="longUrl" 
                                id="longUrl" 
                                value={values.longUrl}
                                onChange={handleChange}
                                className={errors.longUrl ? "border-danger" : ""}
                                placeholder="Long URL" />
                            {errors.longUrl && 
                            <FormText color="danger">
                                    {errors.longUrl}
                            </FormText>}
                        </>
                    )  :
                            <a href={values.longUrl} className="text-secondary d-block text-break" target="_blank">{urlFormState.longUrl}</a>
                }
                <br />
                { !urlFormState.createURL ? (
                    <Alert className="mt-1" color="info">
                        {urlFormState.alreadyExistsError && "URL already exists."} Your Short URL is <a href={url + "/" + urlFormState.shortUrl}  target="_blank"
                         className="alert-link">
                            {url + "/" + urlFormState.shortUrl}</a>.
                    </Alert>
                ) : "" }
                { addName ? (
                    <>
                    <Label for="name">Title</Label>{"  "}
                    <Input 
                        type="text" 
                        name="name" 
                        id="name" 
                        onChange={handleChange}
                        value={values.name}
                        placeholder="Enter Title" />
                    </>
                ) : <p className="float-right small-link m-1" color="secondary" role="button" onClick={() => setAddName(true)}>
                +Add Title</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={(e) => {
              const endPoint = urlFormState.createURL ? url + "/url/create": url + "/url/update/name";
              const reqMethod = urlFormState.createURL ? "POST" : "PATCH";
              handleSubmit(e, endPoint, {
                "Authorization" : authenticationState.token
            }, reqMethod)
            }}>{urlFormState.createURL ? "Create" : "Update"}</Button>
        </ModalFooter>
      </Modal>
    )

}


export default URLForm;