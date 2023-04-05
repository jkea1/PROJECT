import './TodoInsert.scss';
import React from 'react';
import {MdAdd} from 'react-icons/md';
import {useCallback, useState, } from 'react';

const TodoInsert = ({onInsert}) => {
    const [value, setValue] = useState('');

    const onChange = useCallback( e => {
        setValue(e.target.value);
    }, [])

    const onSubmit = useCallback( //onClick event로 바꿔서 할 수 있다. 대신 form이 아닌 button 에 넣어준다. 279p
        e => {
            onInsert(value);
            setValue(''); //value 값 초기화 
            //submir event 는 브라우져에서 새로고침을 발생시킨다. 
            //이를 막기 위해 아래의 함수를 호출한다. 
            e.preventDefault();
        },
        [onInsert, value],
    );
    
    return (
        <form className='TodoInsert' onSubmit={onSubmit}>
            <input 
            placeholder="할 일을 입력하세요"
            value={value}
            onChange={onChange}
            />
            <button type="submit">
                <MdAdd />
            </button>
        </form>
    )
}

export default TodoInsert