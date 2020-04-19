import React, { Component } from 'react';

import Layout from '../../components/Shared/Layout';
import Datatable from '../../components/Shared/Datatable';
import { columns } from './data';

// import { getProducts } from '../../../api';

class StockPage extends Component {
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
        sortBy: [{ id: 'diagnosis', desc: false }],
      },
    };
    // this.fetchData = this.fetchData.bind(this);
  }

  //   fetchData({ pageSize, pageIndex, sortBy, filters }) {
  //     const sort = sortBy.reduce((prev, s) => `${prev}${s.id},${s.desc ? 'DESC' : 'ASC'}`, '');
  //     const filter = filters.reduce((prev, f) => ({ ...prev, [f.id]: f.value }), {});
  //     const param = { page: pageIndex, size: pageSize, sort, ...filter };

  //     getProducts(param).then(({ content, totalPages }) => {
  //       this.setState((prevState) => ({
  //         ...prevState,
  //         data: { ...prevState.data, rows: content, pageCount: totalPages },
  //       }));
  //     });
  //   }

  render() {
    const { history } = this.props;
    const { data, pageInitialState } = this.state;

    return (
      <Layout history={history}>
        <div className="card bg-transparent text-white mb-4">
          <div className="card-header">Past Diagnosis</div>
          <div className="card-body">
            <Datatable
              columns={data.columns}
              data={data.rows}
              fetchData={() => ''}
              pageInitialState={pageInitialState}
              pageCount={data.pageCount}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

export default StockPage;
