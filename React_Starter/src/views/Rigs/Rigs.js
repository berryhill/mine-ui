import React, {Component} from 'react';
import axios from 'axios'
import {Bar, Doughnut, Line, Pie, Polar, Radar} from 'react-chartjs-2';
import {
    Badge,
    Card,
    CardHeader,
    CardBody,
    Col,
    Container,
    Row,
    Table,
} from 'reactstrap';

const data1 = [489, 500, 910, 890, 896, 903, 906];
const data2 = [0, 1100, 1115, 1090, 1110, 1113, 1089];

var cron = require('node-cron');

const line = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Charly',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: '#f1fa8c',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: data1
        },
        // {
        //     label: 'Danny',
        //     fill: false,
        //     lineTension: 0.1,
        //     backgroundColor: 'rgba(75,192,192,0.4)',
        //     borderColor: 'rgba(75,0,192,1)',
        //     borderCapStyle: 'butt',
        //     borderDash: [],
        //     borderDashOffset: 0.0,
        //     borderJoinStyle: 'miter',
        //     pointBorderColor: 'rgba(75,192,192,1)',
        //     pointBackgroundColor: '#fff',
        //     pointBorderWidth: 1,
        //     pointHoverRadius: 5,
        //     pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        //     pointHoverBorderColor: 'rgba(220,220,220,1)',
        //     pointHoverBorderWidth: 2,
        //     pointRadius: 1,
        //     pointHitRadius: 10,
        //     data: [0, 1100, 1115, 1090, 1110, 1113, 1089]
        // }
    ]
};

const rig = {
    power: true,
    miner: true,
};

class Rigs extends Component {

  constructor(props) {
    super(props);
    this.getMine = this.getMine.bind(this);
    this.state = {
      power: false,
      miner: false,
      lastPing: null,
      totalHashRate: "0 Mh/s",
      mine: null,
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.getMine, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let last_ping = "loading";
    let total_hash_rate = "loading";
    let mine = "loading";
    if (this.state.lastPing != null) {
      last_ping = this.state.lastPing;
      total_hash_rate = this.state.totalHashRate;
    }

    return (
      <div className="animated fadeIn">

        <Container>
          {/*<Row xs="12">*/}
              <Card>
                <CardBody>
                  {/*<Table responsive>*/}
                    <div className="side-by-side">
                      <div className="padd">Charly</div>
                      <div className="padd"><Badge color="success">On</Badge></div>
                      <div className="padd"><Badge color="success">Active</Badge></div>
                      <div className="padd">{total_hash_rate}</div>
                      {/*<td>{last_ping.time}</td>*/}
                    </div>
                  {/*</Table>*/}
                  {/*<Table responsive>*/}
                    {/*<thead>*/}
                    {/*<tr>*/}
                      {/*<th>Rig</th>*/}
                      {/*<th>Power</th>*/}
                      {/*<th>Miner</th>*/}
                      {/*<th>Hashrate</th>*/}
                      {/*<th>LastPing</th>*/}
                    {/*</tr>*/}
                    {/*</thead>*/}
                    {/*<tbody>*/}
                    {/*<tr>*/}
                    <div className="side-by-side">
                      <div className="padd">Charly</div>
                      <div className="padd"><Badge color="success">On</Badge></div>
                      <div className="padd"><Badge color="success">Active</Badge></div>
                      <div className="padd">{total_hash_rate}</div>
                    </div>
                      {/*<td>{last_ping.time}</td>*/}
                    {/*</tr>*/}
                    {/*</tbody>*/}
                  {/*</Table>*/}
                </CardBody>
              </Card>
          {/*</Row>*/}
          <Row>
        <Col xs="3">
        <Card>
          <CardBody>
            <div className="chart-wrapper">
              <Line data={line}
                    height={250}
                    options={{
                      maintainAspectRatio: false
                    }}
              />
            </div>
          </CardBody>
        </Card>
        </Col>
        <Col xs="6">
        <Card>
          <CardBody>
            <Container>
              <Row>
            <Col>
            <Rig mine={this.state.mine}/>
            </Col>
              </Row>
            </Container>
          </CardBody>
        </Card>
        </Col>
            <Col xs="2">
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  getMine() {
    axios.get('http://localhost:5051')
      .then(response => this.setState(
        {mine: response.data, lastPing: response.data.last_ping, totalHashRate: response.data.total_hash_rate}))
  }
}
export default Rigs;

class Rig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mine: props.mine
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.mine = nextProps.mine
  }

  render() {

    if (this.state.mine === null ||
        this.state.mine === "loading" ||
        this.state.mine.gpus.length === 0 ||
        this.state.mine.gpus === null
    ) {
      return (
        <div>
          loading...
        </div>
      )
    } else {
      return (
        <div>
          <div>
            <Table responsive size="sm">
              <thead>
              <tr>
                <th>GPU</th>
                <th>Hash</th>
                <th>Temp</th>
                <th>Fan</th>
                <th>Power</th>
              </tr>
              </thead>
              {this.state.mine.gpus.map(function (gpu, index) {
                return (
                  <tbody>
                  <tr>
                    <td>GPU {index}</td>
                    <td>
                      <FadingText text={gpu.hash_rate}/>
                      </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  </tbody>
                )})}
            </Table>
          </div>
        </div>
      )
    }
  }
}

const FadingText = ({text}) => {
  // let t;
  const componentClasses = ['example-component'];
  // delete componentClasses[1];
  // t = text;
  // console.log("start");
  // let await = sleep(500);
  // console.log("stop");
  componentClasses.push('show');

  return (
    <div className={componentClasses.join(' ')}>{text}</div>
  );
};

// FadingText.propTypes = {
//   text: React.PropTypes.string.isRequired
// };
