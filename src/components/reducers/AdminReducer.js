export const initialState = false;

const reducer = (state, action) => {
    if(action.type === "ADMIN"){
        return action.payload;
    }
    return state;
}
export {reducer}
