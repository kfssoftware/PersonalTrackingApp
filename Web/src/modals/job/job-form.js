import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Actions as ApiCallActions } from "redux/apiCall/reducers"
import { useDispatch } from "react-redux";
import memoize from "fast-memoize";
import Validator from "components/high-level/validator";
import { FormInputPassword, FormInput, FormInputNumber, FormAction, FormInputMask, FormContainer, FormSelect, FormSwitch, FormTreeSelect, FormMultiFileUpload } from "components/high-level/form";
import { CloseOutlined, MailOutlined, SaveOutlined, UserOutlined, KeyOutlined, PlusCircleOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import general from "utils/general";
import i18next from "i18next";
import { Modal, Row, Col, Button, Form, Input, Spin } from 'antd';
import useRefState from "utils/use-ref-state";
import { StatusEnum, UserTypeEnum } from 'utils/enums';
import EventBus from "infrastructure/event-bus/event-bus";
import { EntityTypeEnum } from "utils/enums/entity-type-enum";
import FormMultiSelect from "components/high-level/form/form-multi-select";

const JobFormModal = ({ nodeKey, id }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState(true);
    const closeModal = () => {
        setIsOpen(false);
    }

    const [, reRender] = useState(null);
    const [validator,] = useState(new Validator());
    const validatorScopeKey = validator.generateNewScopeKey();
    const [fileLoading, setFileLoading] = useState(false)

    const [loading, setLoading] = useState(true);
    const [formProps, formPropsRef, setFormProps] = useRefState({});
    const updateFormProps = (values) => {
        setFormProps(curr => ({ ...curr, ...values, }))
    };
    const [loadAndSelectDeviceGroup, setLoadAndSelectDeviceGroup] = useState([]);
    const [loadAndSelectOrganizationGroup, setLoadAndSelectOrganizationGroup] = useState([]);

    useEffect(() => {
        if (!general.isNullOrEmpty(id)) {
            setLoading(true)
            const oldJobs = JSON.parse(localStorage.getItem('jobs'));
            const getFindJob = oldJobs.find(function (item, i) {
                return item.id === id
            });
            setFormProps(getFindJob);
            setTimeout(() => {
                setLoading(false)
            }, 200);
        }
        else {
            setLoading(false)
        }
    }, []);

    const onFinish = values => {
        reRender(1);
        if (!general.isNullOrEmpty(formPropsRef?.current?.priority)) {
            form.resetFields();
            let newValues = values;
            newValues.priority = formPropsRef?.current?.priority;
            newValues.priorityName = formPropsRef?.current?.priorityName;
            newValues.priorityColor = formPropsRef?.current?.priorityColor;
            setLoading(true);
            if (general.isNullOrEmpty(id)) { // create
                let oldJobs = JSON.parse(localStorage.getItem('jobs'));
                if (general.isNullOrEmpty(oldJobs)) oldJobs = [];
                newValues.id = Math.floor(Math.random() * 10000);
                oldJobs.push(newValues);
                localStorage.setItem('jobs', JSON.stringify(oldJobs));
                EventBus.sc.onEntityCreated({ entityType: EntityTypeEnum.Job, entityId: newValues.id });
                setIsOpen(false);
                setLoading(false)
                general.messageSuccess("Save Success");

            } else { // update
                const oldJobs = JSON.parse(localStorage.getItem('jobs'));
                var index = oldJobs.findIndex(function (item, i) {
                    return item.id === id
                });
                let newJobs = oldJobs;
                newValues.id = id;
                newJobs[index] = newValues;
                localStorage.setItem('jobs', JSON.stringify(newJobs));
                EventBus.sc.onEntityUpdated({ entityType: EntityTypeEnum.Job, entityId: id });
                setIsOpen(false);
                setLoading(false)
                general.messageSuccess("Edit Success");
            }
        }
        else {
            general.messageError("Priority Required");
        }
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const onChangeName = useCallback((val) => updateFormProps({ name: val }), []);
    const onChangePriority = useCallback((parent) => {
        updateFormProps({ priority: parent?.value, priorityName: parent?.name, priorityColor: parent?.color });
    }, []);
    return (
        <Modal
            title={general.isNullOrEmpty(id) ? "Add Job" : "Edit Job"}
            visible={isOpen}
            width={700}
            onCancel={closeModal}
            footer={null}
        >
            {
                loading ? <Spin />
                    :
                    <Form
                        name="basicInformation"
                        layout="vertical"
                        initialValues={formProps}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={24} >
                                <Form.Item
                                    label="Job Name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter the name of the job",
                                        },
                                        {
                                            type: "string",
                                            min: 1,
                                            max: 255,
                                            message: "Job name must not exceed 255 characters",
                                        },
                                    ]}
                                >
                                    <Input className='w-100' placeholder="Job Name" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} >
                                <FormSelect
                                    controller="Priority"
                                    label="Priority"
                                    nameKey="name"
                                    selectedId={formProps?.priority}
                                    selectedName={formProps?.priorityName}
                                    errorMessage={validator.register("priority", formProps?.priority, [{ rule: "required" }], validatorScopeKey)}
                                    onChange={onChangePriority}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={24} className="right border-top pt-4">
                                <Button key="back" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button type="primary" className='ml-2' key="submit" htmlType="submit">
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Form>
            }
        </Modal>
    )
}

export default JobFormModal;