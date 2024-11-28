import "./FriendList.css"
import SearchIcon from '@mui/icons-material/Search'
import placeHolderAvatar from "../chatComponents/placeholder_avatar.png"
import {useCallback, useEffect, useState} from "react";
import BlockIcon from '@mui/icons-material/Block';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {FriendSearch as FriendSearchAPI, UpdateFriendStatus as UpdateFriendStatusAPI} from "../../API/friendlist.ts";
import {useUser} from "../../context/UserContext.tsx";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

type BasicUserInfo = {
    id: string
    username: string
    avatarPath: string
    status: string
    friendId: string
}

function FriendList() {

    const {user: currentUser} = useUser()
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [users, setUsers] = useState<BasicUserInfo[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const filteredUsers = users.filter((user: BasicUserInfo) => {
        const matchesStatus = user.status === statusFilter
        const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const updateUserStatus = async (friendId: string, status: string) => {
        const token = localStorage.getItem("jwt")
        if (token) {
            try {
                await UpdateFriendStatusAPI(token, friendId, status)
                await handleSearchUsers()
            } catch (err) {
                console.log(err)
                return
            }
        }
    }

    const handleSearchUsers = useCallback(async () => {
        const token = localStorage.getItem("jwt")
        if (token && currentUser) {
            try {
                const data = await FriendSearchAPI(searchQuery, token)
                setUsers(data)
            } catch (error) {
                return setUsers([])
            }
        }
    }, [searchQuery])

    useEffect(() => {
        if (currentUser) {
            setLoading(false)
            handleSearchUsers()
        }
    }, [currentUser, handleSearchUsers])

    if (loading || currentUser?.id === undefined) {
        return <div>Loading...</div>
    }

    return (
        <div className={"friendListContainer"}>
            <div className={"friendListHeader"}>
                <div className={"friendListSearchContainer"}>
                    <input className={"friendListSearchInput"} placeholder={"Type here to search..."} onChange={(e) => {
                        setSearchQuery(e.target.value)
                    }}></input>
                    <button className={"friendListSearchButton"} onClick={handleSearchUsers}><SearchIcon/></button>
                </div>
                <div className={"friendListStatusContainer"}>
                    <span className={"friendListStatusText"}
                          onClick={() => setStatusFilter("accepted")}>Friend list</span>
                    <span className={"friendListStatusText"}
                          onClick={() => setStatusFilter("pending")}>Friend requests</span>
                    <span className={"friendListStatusText"} onClick={() => setStatusFilter("")}>Find new friends</span>
                </div>
            </div>
            <div className={"friendListContentContainer"}>
                {
                    filteredUsers.map((user, index) => {
                        const isCurrentUserFriendRequest = user.friendId !== currentUser?.id?.toString()
                        return (
                            <div className="friendListContent" key={index}>
                                <div className="friendListAvatarContainer">
                                    <img
                                        className="friendListAvatar"
                                        src={user.avatarPath || placeHolderAvatar}
                                        alt={`${user.username}'s avatar`}
                                    />
                                </div>
                                <div className="friendListUsernameContainer">
                                    <span className="friendListUsername">{user.username}</span>
                                    <div>
                                        <span>{}</span>
                                    </div>
                                </div>
                                <div className="friendListActionContainer">
                                    {user.status === "pending" ? (
                                        isCurrentUserFriendRequest ? (
                                            <>
                                                <div className="friendListAction" onClick={() => updateUserStatus(user.id, "")}>
                                                    <span className="friendListActionIcon">
                                                        <PersonRemoveIcon />
                                                    </span>
                                                </div>
                                                <div className="friendListAction" onClick={() => updateUserStatus(user.id, "blocked")}>
                                                    <span className="friendListActionIcon">
                                                        <BlockIcon />
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="friendListAction" onClick={() => updateUserStatus(user.id, "accepted")}>
                                                    <span className="friendListActionIcon">
                                                        <PersonAddIcon />
                                                    </span>
                                                </div>
                                                <div className="friendListAction" onClick={() => updateUserStatus(user.id, "")}>
                                                    <span className="friendListActionIcon">
                                                        <PersonRemoveIcon />
                                                    </span>
                                                </div>
                                                <div className="friendListAction" onClick={() => updateUserStatus(user.id, "blocked")}>
                                                    <span className="friendListActionIcon">
                                                        <BlockIcon />
                                                    </span>
                                                </div>
                                            </>
                                        )
                                    ) : user.status === "accepted" ? (
                                        <>
                                            <div className="friendListAction">
                                                <span className="friendListActionIcon">
                                                    <ChatBubbleIcon />
                                                </span>
                                            </div>
                                            <div className="friendListAction" onClick={() => updateUserStatus(user.id, "")}>
                                                <span className="friendListActionIcon">
                                                    <PersonRemoveIcon />
                                                </span>
                                            </div>
                                            <div className="friendListAction" onClick={() => updateUserStatus(user.id, "blocked")}>
                                                <span className="friendListActionIcon">
                                                    <BlockIcon />
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="friendListAction" onClick={() => updateUserStatus(user.id, "pending")}>
                                                <span className="friendListActionIcon">
                                                    <PersonAddIcon />
                                                </span>
                                            </div>
                                            <div className="friendListAction" onClick={() => updateUserStatus(user.id, "blocked")}>
                                                <span className="friendListActionIcon">
                                                    <BlockIcon />
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FriendList