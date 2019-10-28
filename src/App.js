import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Modal from 'react-bootstrap/Modal'
import Navbar from 'react-bootstrap/Navbar'

const devEnvironment = "http://localhost:8080/posts"
const prodEnvironment = "https://poolitenboardapi.herokuapp.com/posts"

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {showNewPostModal : false}
    this.state = {posts : []}
  }

  sorters = {
      byDate: function(a,b) {
          return (a.date > b.date);
      },
      byPopularity : function(a,b) {
          return (a.upvotes > b.upvotes);
      },
      byTitle : function(a,b) {
          return (a.title > b.title);
      }
  };

  componentDidMount() {
    this.getAllPosts()
  }

  render() {
    return (
      <div className="App">
        <Navbar fixed="top" expand="lg" variant="dark" bg="primary">
          <Navbar.Brand href="#">The POOLiten Board</Navbar.Brand>
        </Navbar>
        <div className="Actions-container">
          <ButtonToolbar>
            <Button variant="primary" onClick={() => this.setState({showNewPostModal : true})} className="Button">
              + New Post
            </Button>
            <DropdownButton variant="info" id="filter" title="Filter" className="Button">
              <Dropdown.Item>Newest</Dropdown.Item>
              <Dropdown.Item>Popular</Dropdown.Item>
              <Dropdown.Item>Title</Dropdown.Item>
            </DropdownButton>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">#</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  placeholder="Search by tag"
                  aria-describedby="inputGroupPrepend"
                  required
                />
              </InputGroup>
          </ButtonToolbar>
        </div>
        <CardColumns className="Card-container">
          {this.state.posts}
        </CardColumns>
        <CreatePostModal
          show={this.state.showNewPostModal}
          onHide={() => this.setState({showNewPostModal : false})}
        />
      </div>
    )
  }

  getAllPosts() {
    fetch(devEnvironment)
    .then(res => res.json())
    .then((data) => {
      this.setState({
        posts:
        data.sort(function(a, b) {
          console.log(a.title > b.title)
          return a.title > b.title;
        })
        .map((post) =>
          <Card>
            <Card.Body>
              <Card.Title>
                {post.title}
                <Button variant="link" className="Edit-button">Edit</Button>
              </Card.Title>
              <Card.Text>{post.body}</Card.Text>
              <Card.Text className="Post-tags">{post.tags}</Card.Text>
              <ButtonToolbar>
                <Button variant="success" className="Button">Upvote {post.upvotes || 0}</Button>
                <Button variant="danger" className="Button">Downvote {post.downvotes || 0}</Button>
              </ButtonToolbar>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">{post.createdAt}</small>
            </Card.Footer>
          </Card>
        )
       })
    })
  }

}

class CreatePostModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {title : ""}
    this.state = {body : ""}
    this.state = {tags : ""}
  }

  createNewPost(state) {
    var payload = {
        title: state.title,
        body: state.body,
        tags: state.tags
    };

    fetch(devEnvironment, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(() => {window.location.reload();})
  }

  handleChange = e => {
    this.setState({[e.target.name] : e.target.value})
  };

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <Form.Control size="lg" type="text" placeholder="Title" onChange={this.handleChange} name="title"/>
            <br />
            <Form.Control type="text" placeholder="Body" onChange={this.handleChange} name="body"/>
            <br />
            <Form.Control size="sm" type="text" placeholder="Comma separated tags" onChange={this.handleChange} name="tags"/>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
          <Button onClick={() => { this.createNewPost(this.state)}}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

function EditPostModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Form.Control size="lg" type="text" placeholder="Title" />
          <br />
          <Form.Control type="text" placeholder="Body" />
          <br />
          <Form.Control size="sm" type="text" placeholder="Comma separated tags" />
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={props.onHide}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default App;
