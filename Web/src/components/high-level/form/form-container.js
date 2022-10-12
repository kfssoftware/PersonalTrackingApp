import { Form, Row } from "antd";
import React from "react";
import FormAction from "./form-action";

const FormContainer = ({ children, headerTitle, headerActions = [], loading, footerActions = [] }) => {

    return (
        <div className="row">
            <div className="col-12 col-md-12">
                <div className="card" style={{}}>
                    <div className="card-header card-header-flex align-items-center">
                        <div style={{ justifyContent: "space-between" }} className="d-flex flex-row align-items-center mr-auto">
                            <h5 className="mb-0 mr-3 font-size-18" style={{ marginRight: "20px" }}>
                                <strong>{headerTitle}</strong>
                            </h5>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            {headerActions?.filter(x => x.show)?.map((action, index) => <div key={index}>{action.node}</div>)}
                        </div>
                    </div>
                    <div className="card-body" style={{}}>
                        <Form layout="vertical">
                            <div className="row">
                                {children}
                                <div className="col-md-12" style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }} >
                                    {footerActions?.filter(x => x.show)?.map((action, index) => <div key={index}>{action.node}</div>)}
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div >
    )

}


export default FormContainer;