import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function Tooltip() {
    return (
        <>
            <OverlayTrigger
                key='top'
                placement='top'
                overlay={
                    <Tooltip id='tooltip-top'>
                    mbti 재설정시 좋아요 목록 초기화 됩니다. 
                    </Tooltip>
                }
            >
                <Button variant="secondary">Tooltip on top</Button>
            </OverlayTrigger>
        </>
    );
}

export default Tooltip;