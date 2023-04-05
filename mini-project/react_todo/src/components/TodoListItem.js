import React from 'react'
import {
    MdCheckBoxOutlineBlank,
    MdCheckBox, 
    MdRemoveCircleOutline,
} from 'react-icons/md';
import cn from 'classnames';
import './TodoListItem.scss';

const TodoListItem = ({todo, onRemove, onToggle}) => {
    const {id, text, checked} = todo; //실수 주의! 객체를 넘겨 줘야 해!
    return (
        <div className='TodoListItem'>
            <div className={cn('checkbox', {checked})} onClick={() => onToggle(id)}> {/* checkedbox 조건없이 적용하고 , 뒤에꺼는 true 일때만 추가로 적용한다. */}
                {checked ? <MdCheckBox/> : <MdCheckBoxOutlineBlank/>}
                <div className='text'>{text}</div>
            </div>
            <div className='remove' onClick = {() => onRemove(id)}>
                <MdRemoveCircleOutline/>
            </div>
        </div>
    )
}

export default TodoListItem;