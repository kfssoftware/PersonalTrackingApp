import React from "react";
import PropTypes from "prop-types";
import { InfoCircleOutlined } from '@ant-design/icons';

export class CustomFlag extends React.Component {
    render() {
        const { flagName, width } = this.props;
        try {
            let flag = require("assets/flags/" + flagName.toUpperCase() + ".png");
            return (<img src={flag} style={{ width: width }} alt={flagName.toUpperCase()} />);
        }
        catch (error) {
            console.log("error",error);
            return (<InfoCircleOutlined style={{ color: "#bf0d0d" }} />);
        }
    }
}

CustomFlag.propTypes = {
    flagName: PropTypes.string,
    width: PropTypes.string
};

CustomFlag.defaultProps = {
    flagName: "remove",
    width: "23px"
};

export default CustomFlag;