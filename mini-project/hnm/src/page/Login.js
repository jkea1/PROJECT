import React from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';


const Login = ({setAuthenticate}) => {

    const navigate = useNavigate()
    const loginUser = (event) => { /* event를 받아온다 */
        event.preventDefault(); /* form에서는 사용해 주는것이 좋다. 페이지가 계속 refresh 되는것을 막을 수 있다. event에서 주는 이럴때 쓰는 함수이다. */
        console.log("login user function issue");
        setAuthenticate(true);
        navigate("/");
    };

    return (
        <Container>
            <Form onSubmit={(event) => loginUser(event)}> {/* 로그인 했을때 새로고침하는 것을 막기위해서 form에서 제공하는 event를 파라미터 값으로 받아온다. */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="danger" type="submit"> {/* variant를 바꿔서 button의 색깔과 디자인을 바꿀수 있다.  */}
                    로그인
                </Button>
            </Form>
        </Container>
    )
}

export default Login