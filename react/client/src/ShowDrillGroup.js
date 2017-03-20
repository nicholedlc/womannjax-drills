import React from 'react';
import { Grid, Row, Panel, ButtonToolbar, Button, Accordion, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class Drill extends React.Component {
  constructor(props){
    super(props);
    this.state = { drill: props.drill }
  }
  render () {

    const style = {
      display: 'flex',
      justifyContent: 'flex-end'
    };

    return (
      <Accordion>
        <Panel header={"< Drill 1 >"} eventKey="1">
          <div>
            {this.state.drill.exercise}
          </div>
          <div style={style}>
            <ButtonToolbar>
              <Button href="#">Edit</Button>
              <Button href="#">Delete</Button>
            </ButtonToolbar>
          </div>
        </Panel>
      </Accordion>
    )
  }
}





export default class ShowDrillGroup extends React.Component{

  constructor(props){
    super(props);
    this.state = {count:1}
    this.addAnotherSolution = this.addAnotherSolution.bind(this);
    this.renderSolutions = this.renderSolutions.bind(this);
  }

  addAnotherSolution() {
    this.setState({count: this.state.count+1})
  }

  renderDrills(drills) {
    let drillsArr = [];
    drills.forEach(drill=>{
      drillsArr.push(<Drill drill={drill}/>)
    })
    return drillsArr;
  }

  renderSolutions() {
    let retArr = [];
    for(let i = 0; i < this.state.count; i++){
      retArr.push(<FormControl componentClass="textarea" placeholder="e.g. Drills for basic routing" />)
    }
    return retArr;
  }

render(){

  const style = {
    display: 'flex',
    justifyContent: 'flex-end'
  };


  return (
    <Grid>
      <Row>
        <h2>Drill Group: {this.props.drillGroup.name}</h2>
      </Row>
      <Row>
        <p>{this.props.drillGroup.description}</p>
      </Row>
      <Row style={style}>
        <Button href="#">
          Edit Group
        </Button>
      </Row>
      <br />

      {this.renderDrills(this.props.drillGroup.drills)}
      <br />

      <Panel header={"Add New Drill"}>
        <FormGroup controlId="new-drill-description">
          <ControlLabel>Description</ControlLabel>
          <FormControl componentClass="textarea" placeholder="e.g. Drills for basic routing" />
        </FormGroup>

        <FormGroup controlId="new-drill-solution">
          <ControlLabel>Solution</ControlLabel>
          {this.renderSolutions()}
        </FormGroup>

        <div>
          <Button href="" onClick={this.addAnotherSolution}>
            Add Another Solution
          </Button>
        </div>

        <div style={style}>
          <Button type="submit">
            Save
          </Button>
        </div>
      </Panel>
    </Grid>
  )
  }
}
