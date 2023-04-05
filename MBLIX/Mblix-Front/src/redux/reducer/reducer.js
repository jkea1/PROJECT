let initialState={
    mbti: '', //action을 CHOOSE_MBTI 와 CHANGE_MBTI 두개를 만들어야 할 거 같아
    changedMbti: '',
    likemovieList:[],
    profileImg: '',
    deleteMovie: '',
    randomMovie: '',
    likeMovieId: [],
}

//mbti 바꾸면 research 목록의 likemovieList 을 initialState로 바꾸면 될거 같아. 

function reducer(state=initialState, action) {
    switch (action.type) {
        case "GET_RANDOM_MOVIE_DATA":
            return {
                ...state, randomMovie : action.randomMovie
            };
        case "DELETE_LIKE_MOVIE" :
            return{
                ...state, likemovieList: state.likemovieList.filter(e => e.name !== action.deleteMovie)
            };
        
        case "RESET_LIKE_LIST" :
            return {
                ...state,
                likemovieList : [],
            };
        
        case "CHANGE_MBTI" :
            return {
                ...state, 
                mbti : action.mbti
            };
        
        case "CHOOSE_MBTI" :
            return {
                ...state, 
                mbti : action.mbti
            }; 
            
        case "LIKE_MOVIE_DETAIL" :
            const { poster_url, name } = action.payload; 
            const updated = {
                ...state ,likemovieList: [...state.likemovieList, {poster_url, name}] 
            };            
            return updated;


        case "CHOOSE_PROFILE_IMG" : 
            return { 
                ...state, profileImg : action.profileImg
            }   

        default: 
        return state
    }
}

export default reducer;