import "./Toaster.css"
import React, { useEffect } from 'react';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { toastStateRecoil } from '../../sharedStates/toastState';

const Toaster = (props) => {

    const [ toastState, setToastState ] = useRecoilState(toastStateRecoil);
    const resetToast = useResetRecoilState(toastStateRecoil);

    useEffect(() => {
        if(toastState.isOpen){
            window.setTimeout(() => {
                resetToast()
            }, 4000)
        }
    }, [toastState])

  return (
      <div className={"rounded float-right toaster-position min-wid " + (toastState.className ? toastState.className : "bg-success")} >
        <Toast isOpen={toastState.isOpen}>
          <ToastHeader toggle={resetToast}>
            {toastState.toastHeader}
          </ToastHeader>
          <ToastBody>
            {toastState.toastBody}
          </ToastBody>
        </Toast>
      </div>
    )
}


export default Toaster;