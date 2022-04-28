// fake implementation

export const natsWrapper = {
    client: {
        publish: jest
            .fn()
            .mockImplementation(
                (subject: string, data: string, callback: () => void) => {
                    // the name of this needs to be callback because that's what is passed in.
                    // our real implementation calls this callback, so we need it to be present otherwise our test hangs and timesout
                    // why is this?
                    // does mockImplementation just hang if it can't find the function to call (callback()) that it expects?
                    // -- it's likely that if the callback function is not executed right away, then mockImplementation does not resolve the promise...
                    callback();
                }
            ),
    },
};
