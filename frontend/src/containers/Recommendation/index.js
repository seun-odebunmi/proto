import React, { Component } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Shared/Layout';
import Datatable from '../../components/Shared/Datatable';
import Button from './Button';
import ModalForm from './modalForm';
import { columns } from './data';

import { getPatMedicalRecords, createUpdateRecommendation } from '../../api';

class DiagnosisPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        columns,
        rows: [],
        pageCount: 0,
      },
      pageInitialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [{ id: 'date', desc: false }],
      },
      modalFormData: {},
      modalAction: '',
      modal: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.modifyRowObject = this.modifyRowObject.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    const token = localStorage.getItem('token');

    if (!token) {
      this.props.history.replace('/login');
    } else {
      if (user.userType_id !== 2) {
        this.props.history.replace('/');
      }
    }
  }

  fetchData({ pageSize, pageIndex, sortBy }) {
    const sort = sortBy.reduce((prev, s) => `${prev}${s.id},${s.desc ? 'DESC' : 'ASC'}`, '');
    const param = { page: pageIndex, size: pageSize, sort };
    // pageCount: totalPages

    getPatMedicalRecords(param).then((response) => {
      const modRows = response ? response.map(this.modifyRowObject) : [];
      this.setState((prevState) => ({
        ...prevState,
        data: { ...prevState.data, rows: modRows },
      }));
    });
  }

  modifyRowObject(row) {
    return {
      ...row,
      action: (
        <Button onClick={this.handleBtnClick} rowData={row} icon="edit-2" action="Recommendation" />
      ),
    };
  }

  handleBtnClick(rowData, action) {
    this.setState((prevState) => ({
      ...prevState,
      modal: !this.state.modal,
      modalAction: action,
      modalFormData: rowData,
    }));
  }

  handleToggle() {
    this.setState((prevState) => ({ ...prevState, modal: !this.state.modal }));
  }

  handleSubmit(values, { setSubmitting }) {
    const { pageInitialState } = this.state;
    createUpdateRecommendation(values).then((res) => {
      this.fetchData(pageInitialState);
      this.handleToggle();
    });
    setSubmitting(false);
  }

  render() {
    const { history } = this.props;
    const { data, pageInitialState, modal, modalAction, modalFormData } = this.state;

    return (
      <>
        <Layout history={history}>
          <div className="card bg-transparent text-white mb-4">
            <div className="card-header">Recommendation</div>
            <div className="card-body">
              <Datatable
                columns={data.columns}
                data={data.rows}
                fetchData={this.fetchData}
                pageInitialState={pageInitialState}
                pageCount={data.pageCount}
              />
            </div>
          </div>
        </Layout>
        {modal && (
          <ModalForm
            open={modal}
            toggle={this.handleToggle}
            onSubmit={this.handleSubmit}
            action={modalAction}
            data={modalFormData}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(DiagnosisPage);
