import React from "react"
import {FormAction} from "components/high-level/form"
import { CloseOutlined, CloseSquareFilled, DeleteOutlined, EyeFilled, FilterFilled } from "@ant-design/icons"
import { Form } from "antd"
import i18next from "i18next"

const FilterContainer = ({ onClickClear, onClickClose, children }) => {

    return (<Form layout="vertical">
        <div className="row" style={{ padding: 10 }}>
            {children}
            <div className="col-md-12" style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                <FormAction text={i18next.t("action.close")} buttonType="light" iconNode={<CloseOutlined />} onClick={onClickClose} />
                <FormAction text={i18next.t("action.clear")} buttonType="danger" onClick={onClickClear} iconNode={<DeleteOutlined />} />
            </div>
        </div>
    </Form>)
}
export default FilterContainer;