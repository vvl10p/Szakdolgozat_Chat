import "./FriendList.css"
import SearchIcon from '@mui/icons-material/Search'
import placeHolderAvatar from "../chatComponents/placeholder_avatar.png"

// 1 oldal van ahol a baratok vannak alatta azok akiket baratoknak ajanl kozos ismeros altal majd ha pending request van akkor az kerul a tetejere
// baratoknal 5 legfrissebb ember alatta expand button, recommendednel 3 es alatta expand
// baratra hovernel message, remove es block gombok jonnek elo
// pendingnel accept vagy reject ha bejovo, ha kimeno akkor revoke
// addig nem lehet message amig nem fogadta el a barat kerelmet



const FriendContent = (status:string) => {
    return (
        <div className={"friendListUserContainer"}>
            <div className={"friendListUserAvatarContainer"}>
                <img src={placeHolderAvatar}/>
            </div>
            <div className={"friendListUserUsernameContainer"}>
                <span>Test Username</span>
            </div>
            <div className={"friendListUserActionContainer"}>
                {status === "friend" && (
                    <>
                        <button className={"friendListUserAction"}>Message</button>
                        <button className={"friendListUserAction"}>Remove</button>
                        <button className={"friendListUserAction"}>Block</button>
                    </>
                )}
                {status === "recommended" && (
                    <>
                        <button className={"friendListUserAction"}>Add</button>
                        <button className={"friendListUserAction"}>Block</button>
                    </>
                )}
                {status === "pending" && (
                    <>
                        <button className={"friendListUserAction"}>Accept</button>
                        <button className={"friendListUserAction"}>Reject</button>
                    </>
                )}
            </div>
        </div>
    )
}

function FriendList() {
    return (
        <div className={"friendListContainer"}>
            <div className={"friendListHeader"}>
                <div className={"friendListSearchContainer"}>
                    <input className={"friendListSearchInput"} placeholder={"Type here to search..."}></input>
                    <button className={"friendListSearchButton"}><SearchIcon/></button>
                </div>
            </div>
            <div className={"friendListContentContainer"}>
                <div className={"friendListPendingContainer"} hidden={true}>

                </div>
                <div className={"friendListFriendContainer"}>

                </div>
                <div className={"friendListRecommendedContainer"}>

                </div>
            </div>
            <div className={"friendListFooter"}>

            </div>
        </div>
    )
}

export default FriendList