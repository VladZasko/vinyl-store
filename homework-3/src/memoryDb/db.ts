export type UserType = {
    userId: string
    login: string
    email: string
    lastName: string
    firstName: string
    createdAt: string
    passwordHash: string
    passwordSalt: string
}

export type postsType = {
    userId: string
    postId: string
    fullName: string
    title: string
    description: string
    createdAt: Date
}

export  type DBType = {
    users: UserType[]
    posts: postsType[]
}

export const db: DBType = {
    users: [],
    posts: []
};
