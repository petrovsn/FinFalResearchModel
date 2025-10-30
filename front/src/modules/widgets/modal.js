import React from "react";

import '../../styles/modal.css'

export const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal_show" : "modal_hide";
    ////console.log("MODAL", show, children, typeof (children))
  
    //let child_elem = React.cloneElement(children, {})
  
    return (
      <div className={showHideClassName}>
        <section className="modal_page">
          <div className="modal_content">
            {children}
          </div>
  
        </section>
      </div>
    );
  };