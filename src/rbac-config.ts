export const rbac = [
    {
        name: 'admin',
        permissions: [
            {
                resources: ['post', 'comment', 'user', 'permission', 'role-permission', 'user-role'],
                action: [
                    {
                        name: "post",
                        owneronly: false
                    },
                    {
                        name: "get",
                        owneronly: false
                    },
                    {
                        name: "put",
                        owneronly: false
                    },
                    {
                        name: "delete",
                        owneronly: false
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
                        owneronly: true
                    },
                    {
                        name: 'get',
                        owneronly: true
                    },
                    {
                        name: 'put',
                        owneronly: true
                    },
                    {
                        name: 'delete',
                        owneronly: true
                    }
                ]
            }
        ]
    }
]