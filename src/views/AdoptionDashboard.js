import React, { useEffect, useState } from "react";
import { Table, Layout, Button, Modal } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import FullPageLoader from "../components/loader";
//services
import {
  getAdoptionRequests,
  ChangeRequestStatus,
} from "../services/user.services";
const { Content } = Layout;

const AdoptionDashboard = ({ getAdoptionRequests }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [adoptionRequest, setAdoptionRequest] = useState([]);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isDogModalVisible, setIsDogModalVisible] = useState(false);

  const showUserModal = () => {
    setIsUserModalVisible(true);
  };

  const handleUserOk = () => {
    setIsUserModalVisible(false);
  };

  const handleUserCancel = () => {
    setIsUserModalVisible(false);
  };

  const showDogModal = () => {
    setIsDogModalVisible(true);
  };

  const handleDogOk = () => {
    setIsDogModalVisible(false);
  };

  const handleDogCancel = () => {
    setIsDogModalVisible(false);
  };

  const getAdoptionHelper = () =>
    new Promise((resolve, reject) => {
      return getAdoptionRequests(resolve, reject);
    });

  const getAdoption = async () => {
    try {
      return await getAdoptionHelper();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(async () => {
    setIsLoading(true);
    let adoptions = await getAdoption();
    setAdoptionRequest(adoptions);
    setIsLoading(false);
  }, []);

  const RequestHandlerHelper = (params, status) =>
    new Promise((resolve, reject) => {
      return ChangeRequestStatus(params, status, resolve, reject);
    });

  const RequestHandler = async (params, status) => {
    try {
      setIsLoading(true);
      await RequestHandlerHelper(params, status);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Request Status",
      dataIndex: "status",
      key: "status",
      width: "100px",
      filters: [
        {
          text: "Pending",
          value: "pending",
        },
        {
          text: "Accepted",
          value: "accepted",
        },
        {
          text: "Rejected",
          value: "rejected",
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (record) => <p>{record.toUpperCase()}</p>,
    },
    {
      title: "Dog Information",
      key: "showDog",
      width: "100px",
      render: (_, record) => {
        return (
          <React.Fragment>
            <Button onClick={showDogModal}>Show Dog Information</Button>
            <Modal
              title="Dog Information"
              visible={isDogModalVisible}
              onOk={handleDogOk}
              onCancel={handleDogCancel}
            >
              <div className="dogAdoption_modal">
                <div className="dogAdoption_modal_left">
                  <img
                    src={record.pet.img}
                    alt={record.pet.name}
                    width={100}
                    height={100}
                  />
                </div>
                <div className="dogAdoption_modal_right">
                  <h3>Name: {record.pet.name}</h3>
                  <h3>Age: {record.pet.age}</h3>
                  <h3>Breed: {record.pet.breed}</h3>
                  <h3>Color: {record.pet.color}</h3>
                  <h3>Weight: {record.pet.weight}</h3>
                  <h3>Location: {record.pet.location}</h3>
                  <h3>Gender: {record.pet.gender}</h3>
                  <h3>Size: {record.pet.size}</h3>
                </div>
              </div>
            </Modal>
          </React.Fragment>
        );
      },
    },
    {
      title: "User Information",
      key: "showUser",
      width: "100px",
      render: (_, record) => (
        <React.Fragment>
          <Button onClick={showUserModal}>Show User Information</Button>
          <Modal
            title="Dog Information"
            visible={isUserModalVisible}
            onOk={handleUserOk}
            onCancel={handleUserCancel}
          >
            <h3>Name: {record.user.name}</h3>
            <h3>Email: {record.user.email}</h3>
            <h3>Location: {record.user.location}</h3>
          </Modal>
        </React.Fragment>
      ),
    },
    {
      title: "Accept Offer",
      key: "accept",
      width: "100px",
      render: (_, record) =>
        record.status === "pending" ? (
          <Button
            onClick={() => {
              return RequestHandler({ id: record._id }, { status: "accepted" });
            }}
          >
            Accept Offer
          </Button>
        ) : (
          <Button disabled={true}>Accept Offer</Button>
        ),
    },
    {
      title: "Reject Offer",
      key: "reject",
      width: "100px",
      render: (_, record) =>
        record.status === "pending" ? (
          <Button
            onClick={() => {
              return RequestHandler({ id: record._id }, { status: "rejected" });
            }}
          >
            Reject Offer
          </Button>
        ) : (
          <Button disabled={true}>Reject Offer</Button>
        ),
    },
  ];

  if (isLoading) return <FullPageLoader />;

  return (
    <Layout className="dashboard_layout">
      <Content
        className="site-layout-background"
        style={{
          margin: 0,
          minHeight: 280,
          height: "100%",
        }}
      >
        <Table
          columns={columns}
          dataSource={adoptionRequest}
          scroll={{ x: 240 }}
        />
      </Content>
    </Layout>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getAdoptionRequests,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AdoptionDashboard);
