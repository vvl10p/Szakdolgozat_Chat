import "./FriendList.css"
import SearchIcon from '@mui/icons-material/Search'
import placeHolderAvatar from "../chatComponents/placeholder_avatar.png"
import {useCallback, useEffect, useState} from "react";
import BlockIcon from '@mui/icons-material/Block';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {FriendSearch as FriendSearchAPI} from "../../API/friendlist.ts";

// 1 oldal van ahol a baratok vannak alatta azok akiket baratoknak ajanl kozos ismeros altal majd ha pending request van akkor az kerul a tetejere
// baratoknal 5 legfrissebb ember alatta expand button, recommendednel 3 es alatta expand
// baratra hovernel message, remove es block gombok jonnek elo
// pendingnel accept vagy reject ha bejovo, ha kimeno akkor revoke
// addig nem lehet message amig nem fogadta el a barat kerelmet

type BasicUserInfo = {
    username: string
    avatarPath: string
}


function FriendList() {

    const [searchQuery, setSearchQuery] = useState<string>("")
    const [users, setUsers] = useState<BasicUserInfo[]>([])

    const handleSearchUsers = useCallback(async () => {
        const token = localStorage.getItem("jwt")
        if (token) {
            try {
                const data = await FriendSearchAPI(searchQuery, token)
                console.log(data)
                setUsers(data)
            } catch (error) {
                return setUsers([])
            }
        }
    }, [searchQuery])

    useEffect(() => {
        handleSearchUsers()
    }, [])

    return (
        <div className={"friendListContainer"}>
            <div className={"friendListHeader"}>
                <div className={"friendListSearchContainer"}>
                    <input className={"friendListSearchInput"} placeholder={"Type here to search..."} onChange={(e) => {
                        setSearchQuery(e.target.value)
                    }}></input>
                    <button className={"friendListSearchButton"} onClick={handleSearchUsers}><SearchIcon/></button>
                </div>
            </div>
            <div className={"friendListContentContainer"}>
                {
                    users.map((user, index) => (
                        <div className={"friendListContent"} key={index}>
                            <div className={"friendListAvatarContainer"}>
                                <img className={"friendListAvatar"} src={user.avatarPath || placeHolderAvatar}
                                     alt={`${user.username}'s avatar`}></img>
                            </div>
                            <div className={"friendListUsernameContainer"}>
                                <span className={"friendListUsername"}>{user.username}</span>
                            </div>
                            <div className={"friendListActionContainer"}>
                                <div className={"friendListAction"}>
                                    <span className={"friendListActionIcon"}>
                                        <BlockIcon/>
                                    </span>
                                </div>
                                <div className={"friendListAction"}>
                                    <span className={"friendListActionIcon"}>
                                        <PersonAddIcon/>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FriendList