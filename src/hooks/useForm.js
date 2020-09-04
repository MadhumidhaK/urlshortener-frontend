import { useState } from 'react';

export const useForm = ( initialValues = {}, validate = () => {}, sucessCB = () => {}, errorCB = () => {}) => {
    const [values, setValues] = useState({
        ...initialValues
    });
    const [ responseStatusCode, setResponseStatusCode ] = useState(undefined);
    const [response, setResponse] = useState({});
    const [errors, setErrors] = useState({
        error: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { type, name } = e.target;
    
        const getValue = () => {
            if (type === 'checkbox') {
                return e.target.checked;
            }
            else if (type === 'select-multiple') {
                return Array.from(e.target.selectedOptions)
                    .map(o => o.value);
            }
            return e.target.value;
        }
        console.log(values)
        console.log(errors)
        const value = getValue();
        setErrors({
            ...errors,
            ...validate({param: name, value: value})
        });
        setValues({ ...values, [name]: value });
    };


    const handleSubmit = async (e, url, headerOptions = {}, method = "POST") => {
            console.log(headerOptions)
            e.preventDefault();
            setIsLoading(true);
            console.log(values);
            console.log("values");
            const receivedResponse = await fetch(url,{
                                method: method,
                                headers: {
                                Accept: 'application/json',
                                "Content-Type": "application/json",
                                ...headerOptions
                                },
                                body: JSON.stringify(values),
                                
                            });
            setResponseStatusCode(receivedResponse.status);
            const res = await receivedResponse.json();
            setIsLoading(false);
            console.log(res)
            if(!res.error){
                setResponse(res);
                return sucessCB(res);
            }

            if(res.data && Array.isArray(res.data)){
                const resErorrs = res.data.reduce((acc, e) => ({...acc, [e.param] : e.msg}), {});
                setErrors({
                    error: "",
                    ...resErorrs
                })
            }else{
                setErrors({
                    ...res
                })
            }
            return errorCB(res, receivedResponse.status);
    };

    return {
        values,
        setValues,
        handleChange,
        handleSubmit,
        responseStatusCode,
        response,
        errors,
        isLoading
    }
}