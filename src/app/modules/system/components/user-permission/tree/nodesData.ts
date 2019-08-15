const nodes = [
    {
        title: '前端',
        key: '0-0',
        expanded: true,
        children: [
            {
                title: '前端-0',
                key: '0-0-0',
                children: [
                    { title: '前端-0-0', key: '0-0-0-0', isLeaf: true },
                    { title: '前端-0-1', key: '0-0-0-1', isLeaf: true },
                    { title: '前端-0-2', key: '0-0-0-2', isLeaf: true }
                ]
            },
            {
                title: '0-0-1',
                key: '0-0-1',
                children: [
                    { title: '前端-1-0', key: '0-0-1-0', isLeaf: true },
                    { title: '前端-1-1', key: '0-0-1-1', isLeaf: true },
                    { title: '前端-1-2', key: '0-0-1-2', isLeaf: true }
                ]
            },
            {
                title: '0-0-2',
                key: '0-0-2',
                isLeaf: true
            }
        ]
    },
    {
        title: '0-1',
        key: '0-1',
        isLeaf: false,
        children: [
            { title: '0-1-0-0', key: '0-1-0-0', isLeaf: true },
            { title: '0-1-0-1', key: '0-1-0-1', isLeaf: true },
            { title: '0-1-0-2', key: '0-1-0-2', isLeaf: true }
        ]
    },
    {
        title: '0-2',
        key: '0-2',
        isLeaf: true
    }
];


export default nodes;
