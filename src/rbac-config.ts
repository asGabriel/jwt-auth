export const rbac = [
    {
        name: 'admin',
        permissions: [
            {
                resources: ['post', 'comment', 'user', 'permission', 'role-permission', 'user-role'],
                action: [
                    {
                        name: "post",
                    },
                    {
                        name: "get",
                    },
                    {
                        name: "put",
                    },
                    {
                        name: "delete",
                    },
                ]
            }
        ],
    },
    {
        name: "user",
        permissions: [
            {
                resources: ['post', 'comment'],
                action: [
                    {
                        name: 'post',
                    },
                    {
                        name: 'get',
                    },
                    {
                        name: 'put',
                    },
                    {
                        name: 'delete',
                    }
                ]
            }
        ]
    }
]