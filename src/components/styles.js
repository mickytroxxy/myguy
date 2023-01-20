import { Dimensions, StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    ProfileFooter: {
        flex: 2,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#B0B0B0",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
        paddingBottom:30,
        zIndex:100,
        marginTop:-20
    },
    ProfileFooterHeader:{
        backgroundColor:'#fff',borderTopLeftRadius: 30, borderTopRightRadius: 30,
        shadowOffset: {
            width: 0,
            height: 2,
          },
          elevation: 1,
          borderBottomWidth:1,
          borderBottomColor:'#63acfa'
    },
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    centeredView:{
        height: '50%',
        marginTop: 'auto',
        backgroundColor:'#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginLeft: 5,
        borderColor:"#009387",
        borderWidth:10,
        marginRight: 5
    },
    text: {
        color: "#52575D"
    },
    addPhotoContainer:{
        backgroundColor: 'rgba(0, 0, 0, 0.5)', height: 50, alignContent:"center", alignItems:"center",
        borderTopLeftRadius:50,borderTopRightRadius:50,borderBottomLeftRadius:700,marginRight:5,
        borderTopRightRadius:700,justifyContent:'center',
    },
    usernameView:{
        backgroundColor: 'rgba(0, 0, 0, 0.5)', height: 50, alignContent:"center", alignItems:"center",
        borderTopLeftRadius:50,borderTopRightRadius:50,borderBottomRightRadius:700,
        justifyContent:'center',marginLeft:5,borderTopLeftRadius:700,
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16
    },
    subText: {
        fontSize: 11,
        color: "#fff",
        textTransform: "uppercase",
        fontWeight: "bold"
    },
    profileImage: {
        position: 'relative',
        width: 200,
        height: 200,
        overflow: 'hidden',
        borderRadius: 100
    },
    profileImg:{
        width: 200, height: 200, borderRadius: 200/ 2
    },
    dm: {
        backgroundColor: "#009387",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 10,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    add: {
        backgroundColor: "#009387",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: -5,
        padding:5,
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 150,
        height: 150,
        borderRadius: 5,
        overflow: "hidden",
        marginHorizontal: 2,
    },
    mediaCount: {
        position: "absolute",
        top: "50%",
        marginTop: -30,
        marginLeft: 30,
        width: 50,
        height: 50,
        backgroundColor:'teal',
        padding:10,
        borderRadius:100,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "rgba(0, 0, 0, 0.38)",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        shadowOpacity: 1
    },
    recent: {
        fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
        padding:10,
    },
    activityIndicator: {
        marginLeft:-10,
        padding:5,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: Dimensions.get("screen").width - 60,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom:20,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    actionViewBtn1:{
        flex:1,justifyContent:'center',width:50,height:50,borderRadius:100,alignItems:'center',alignContent:'center',
        shadowColor: "#B0B0B0",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 1.5,
        shadowRadius: 1,
        elevation: 2,
    },
    actionView:{
        margin:5,
        marginTop:10,
        height:100,
        borderRadius:5,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.9,
        shadowRadius: 2.84,
        elevation: 2,
        padding:5,
        },
        actionViewBtnContainer: {
        width: 110,
        height: 110,
        overflow: "hidden",
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
        borderBottomLeftRadius:60,
        marginRight:10,
      
    },
    actionViewBtn:{
        height:110,
        backgroundColor:'#fff',
        alignContent:'center',
        alignItems:'center',
        width:110,
    },
    actionViewText:{
        color:'#fff',
        fontWeight:'500',
        fontFamily:'sans-serif-medium',
        textTransform:'uppercase',
        fontSize:9,
        alignContent:'center',alignItems:'center'
    },
    interestBtnHolder:{
        height:60,
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        width:60,
        borderRadius:100,
        shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.9,
        shadowRadius: 2.84,
        elevation: 2,
    },
    requestTypeViewHolder:{
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        borderRadius:20,
        padding:1,
    },
    requestTypeView:{
        width:'100%',
        backgroundColor:'#fff',
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        padding:7
    },
    activeBtn:{
        backgroundColor:'#63acfa',padding:10,borderRadius:8,margin:5
    },
    non_activeBtn:{
        borderColor:'#63acfa',borderWidth:1,padding:10,borderRadius:8,margin:5
    },
});