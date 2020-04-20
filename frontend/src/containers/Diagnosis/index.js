import React, { Component } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Shared/Layout';
import Datatable from '../../components/Shared/Datatable';
import Button from './Button';
import Modal from './modalForm';
import { columns } from './data';

import { getMedicalRecords } from '../../api';

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
    this.modifyRowObject = this.modifyRowObject.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;

    if (user.userType_id !== 1) {
      this.props.history.replace('/Recommendation');
    }
  }

  fetchData({ pageSize, pageIndex, sortBy }) {
    const sort = sortBy.reduce((prev, s) => `${prev}${s.id},${s.desc ? 'DESC' : 'ASC'}`, '');
    const param = { page: pageIndex, size: pageSize, sort };
    // pageCount: totalPages;

    getMedicalRecords(param).then((response) => {
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
      action:
        row.Recommendation !== null ? (
          <Button
            onClick={this.handleBtnClick}
            rowData={row.Recommendation}
            icon="maximize-2"
            action="Recommendation"
          />
        ) : (
          'No recommendation yet!'
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

  render() {
    const { history } = this.props;
    const { data, pageInitialState, modal, modalAction, modalFormData } = this.state;

    return (
      <>
        <Layout history={history}>
          <div className="card bg-transparent text-white mb-4">
            <div className="card-header">Past Diagnosis</div>
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
          <Modal
            open={modal}
            toggle={this.handleToggle}
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
