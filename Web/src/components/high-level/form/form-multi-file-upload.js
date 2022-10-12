import { DeleteOutlined, DownloadOutlined, EyeOutlined, FileDoneOutlined, FileFilled, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Form, Modal } from "antd";
import i18next from "i18next";
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux";
import apiService from "services/api/apiService";
import general from "utils/general";
import useRefState from "utils/use-ref-state";
import GridPopconfirmAction from "../virtualized-grid/grid-popconfirm-action";
import { FormAction } from "./";

const FormMultiFileUpload = ({
    maxFileCount = 5,
    maxFileLength,
    value = "[]",
    fileType,
    readOnly,
    errorMessage,
    antdFormItemProps,
    onChange,
    label,
    onChangeLoading,
    accept,
    hideWhenNotFileUploadedOnReadOnlyMode
}) => {

    const [files, filesRef, setFiles] = useRefState([]);
    const [fileSizes, fileSizesRef, setFileSizes] = useRefState([]);
    const [keyForInput, setKeyForInput] = useState(general.generateRandomString(10));
    const [imageViewerState, setImageViewerState] = useState({ modalOpen: false, url: "" });
    useEffect(() => {
        setFiles(JSON.parse(general.isNullOrEmpty(value) ? "[]" : value));
    }, [value]);


    const [loading, setLoading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);


    const deleteFile = useCallback(index => {
        const deletedItem = filesRef.current[index];
        onChange(JSON.stringify([...filesRef.current.filter(x => x.downloadUrl !== deletedItem.downloadUrl)]));
    }, []);

    const showImage = useCallback(index => {
        const file = filesRef.current[index];
        setImageViewerState({ modalOpen: true, url: file?.downloadUrl });
    }, []);

    const inputRef = useRef(null);

    const onFileSelect = useCallback(async (e) => {
        if (e.target?.files?.length > 0) {
            if (maxFileCount > 1) {
                for (let i = 0; i < e.target.files.length; i++)
                    if (i < maxFileCount)
                        uploadFile(e.target.files[i]);
            }
            else
                uploadFile(e.target.files[0]);
        }
        setKeyForInput(general.generateRandomString(10));
    }, []);

    const onClcikSelectFile = useCallback((e) => {
        e.preventDefault();
        if (inputRef.current)
            inputRef.current.click()
    }, {});

    const uploadFile = useCallback(async (file) => {
        //upload process
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);
        // formData.append('fileSizes', [...fileSizesRef.current, file.size]);
        if (maxFileLength != null)
            formData.append('MaxFileLength', maxFileLength);
        setUploadPercent(0);
        setLoading(true);
        if (onChangeLoading instanceof Function)
            onChangeLoading(true);
        var uploadResult = await apiService.makeApiCall({
            controller: "upload-file",
            method: "post",
            axiosOptions: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + global?.token,
                    Accept: 'application/json',
                },
                onUploadProgress: progressEvent => {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadPercent(percentCompleted);
                },
                data: formData
            }
        });
        setLoading(false);
        if (onChangeLoading instanceof Function)
            onChangeLoading(false);
        if (uploadResult.error) {
            general.notificationError(uploadResult.errorMessage);
            return;
        }
        else
            setFileSizes([...fileSizesRef.current, file.size])

        if (onChange instanceof Function)
            onChange(JSON.stringify([...filesRef.current, { ...uploadResult.data[0], accept: accept }]));
    }, []);


    if (readOnly && hideWhenNotFileUploadedOnReadOnlyMode && files.length == 0)
        return null;

    return (
        <div>
            <Modal
                visible={imageViewerState.modalOpen}
                footer={null}
                width={1000}
                title={i18next.t("general.file_viewer")}
                onCancel={() => setImageViewerState(curr => ({ ...curr, modalOpen: false }))}
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img alt="example" class='image-modal-img' resiz src={imageViewerState.url} />

                </div>
            </Modal>
            <Form.Item
                validateStatus={general.isNullOrEmpty(errorMessage) ? "" : "error"}
                help={errorMessage}
                style={{ display: "flex", }}

                {...antdFormItemProps}
            >
                <Card size="small" style={{ flex: 1, border: '0px', padding: 0 }}>
                    <div style={{ display: "flex", flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {(readOnly && files?.length === 0) &&
                            <p style={{ textAlign: "center", marginTop: 40, marginBottom: 40 }}>{i18next.t("general.no_files_found")}</p>

                        }
                        {files?.map((file, index) => {
                            const extension = general.getFileExtension(file.downloadUrl);
                            const isImage = general.isImageExtension(extension);

                            return (
                                <div key={index}>
                                    <div style={{ margin: 5, borderRadius: 5, borderWidth: 1, borderColor: "#e4e9f0", borderStyle: "solid", overflow: "hidden" }}>
                                        <a href="#" onClick={(e) => {
                                            e.preventDefault();
                                            if (isImage)
                                                showImage(index)
                                            else
                                                window.location = file?.downloadUrl
                                        }} >
                                            {isImage &&
                                                <img style={{ objectFit: "cover" }} src={file?.downloadUrl} height={125} width={125} />
                                            }
                                            {!isImage &&
                                                <div style={{ display: "flex", alignItems: "center", width: 125, flexDirection: "column", height: 125, justifyContent: "center" }}>
                                                    <FileDoneOutlined />
                                                    <p style={{ marginBottom: 0 }}>{extension} {i18next.t("general.file")}</p>
                                                    {
                                                        file.fileName != null &&
                                                        <p style={{ marginBottom: 0, textAlign: "center" }}>{file.fileName.length > 30 ? file.fileName.substring(0, 30) : file.fileName}</p>
                                                    }
                                                </div>
                                            }
                                        </a>
                                    </div>
                                    <div style={{ flexDirection: "row", display: "flex", justifyContent: "center", alignItems: "center", marginRight: 3 }}>
                                        {isImage &&
                                            <FormAction onClick={() => showImage(index)} iconNode={<EyeOutlined />} />
                                        }
                                        <FormAction onClick={() => { window.location = file?.downloadUrl }} buttonType="success" iconNode={<DownloadOutlined />} />
                                        {!readOnly &&
                                            <GridPopconfirmAction
                                                actionProps={{
                                                    buttonType: "danger",
                                                    iconNode: <DeleteOutlined />
                                                }}
                                                onClickYes={() => deleteFile(index)} />
                                        }
                                    </div>
                                </div>
                            )
                        })}
                        {(files?.length < maxFileCount && !readOnly) &&
                            <div>
                                {[0].map(x => (
                                    <input accept={accept} key={keyForInput} max={maxFileCount} multiple={maxFileCount > 1} onSelect={onFileSelect} value={null} style={{ display: "none" }} ref={inputRef} type="file" onChange={onFileSelect} />
                                ))}
                                <p style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>{label}</p>
                                <a href="#" onClick={onClcikSelectFile}>
                                    <div style={{
                                        margin: 5, marginLeft: 0, borderRadius: 5, borderWidth: 1,
                                        borderColor: "#e4e9f0", borderStyle: "solid",
                                        justifyContent: "center", alignItems: "center",
                                        display: "flex", flexDirection: "column",
                                        overflow: "hidden", width: 125, height: 125
                                    }}>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <p style={{ marginBottom: 0 }}>
                                            {loading && (uploadPercent == 100 ? i18next.t("general.processing") : i18next.t("general.uploading").replace("[percent]", uploadPercent))}
                                            {!loading && i18next.t("general.file_select")}
                                        </p>
                                    </div>
                                </a>
                            </div>
                        }
                    </div>
                </Card>
            </Form.Item>
        </div>
    )
}

export default FormMultiFileUpload;