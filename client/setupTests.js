const mockGetUserMedia = jest.fn(async () => {
    return new Promise(resolve => {
        resolve();
    });
});

Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
        getUserMedia: mockGetUserMedia,
    },
})
