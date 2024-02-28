import { FC, useEffect } from 'react'
import TestLessonService from '../../services/TestLessonService'
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

const CreateTestLesson: FC = () => {
    const location = useLocation();
    const navigate = useNavigate()
    useEffect(() => {
        const createGroup = async () => {
            await TestLessonService.createGroup().then(resp=> {
                if(resp.data.group._id) {
                    navigate('/testlesson/'+resp.data.group._id, {state: {from: location}, replace: true})
                }
            });
        }
        void createGroup();
    }, [])

}

export default CreateTestLesson;