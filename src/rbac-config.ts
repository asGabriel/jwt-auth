export const rbac = [
    {
        name: 'admin',
        permissions: [
            {
                resources: ['posts', 'comments', 'users'],
                action: [
                    {
                        name: "create",
                        owneronly: false
                    },
                    {
                        name: "read",
                        owneronly: false
                    },
                    {
                        name: "update",
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
                resources: ['posts', 'comments'],
                action: [
                    {
                        name: 'create',
                        owneronly: true
                    },
                    {
                        name: 'read',
                        owneronly: true
                    },
                    {
                        name: 'update',
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