import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ResizeObserver from "./__mocks__/resizeObserver.mock";
import DownloadChart from "../components/DownloadChart";
import LineChart from "../components/LineChart";

describe("Downloadchart", () => {
    it("should render a title", async () => {
        render(
            <DownloadChart 
                title="Chart Title"
                filename="Filename.png"
                Chart={LineChart}
                labelvals={[]}
                datavals={[]}
                datalabels={[]}
                setStart={() => {}}
                setRange={() => {}}
                queryLoading={false}
            />
       );

        expect(screen.getByText("Chart Title")).toBeDefined();
    })

    it("convert graph to base64 string", async () => {
        const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: {
            href: "",
        } });

        render(
            <DownloadChart 
                title="Chart Title"
                filename="Filename.png"
                Chart={LineChart}
                labelvals={[]}
                datavals={[]}
                datalabels={[]}
                setStart={() => {}}
                setRange={() => {}}
                queryLoading={false}
            />
       );

        const user = userEvent.setup();

        expect(useRefSpy).toBeCalled();
        expect(screen.getByTestId("download")).toBeVisible();

        await user.click(screen.getByTestId("download"))
    })

    it("should update the current starting date", async () => {
        const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: {
            href: "",
        } });

        render(
            <DownloadChart 
                title="Chart Title"
                filename="Filename.png"
                Chart={LineChart}
                labelvals={[]}
                datavals={[]}
                datalabels={[]}
                setStart={(date) => {}}
                setRange={() => {}}
                queryLoading={false}
            />
       );

        const user = userEvent.setup();

        expect(useRefSpy).toBeCalled();
        expect(screen.getByPlaceholderText("Visit Date")).toBeVisible();
        
        await user.type(
            screen.getByPlaceholderText("Visit Date"),
            "2020-08-21"
        );

        expect(screen.getByDisplayValue("2020-08-21")).toBeVisible();
    })

    it("should update range 30-day", async () => {
        const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: {
            href: "",
        } });

        render(
            <DownloadChart 
                title="Chart Title"
                filename="Filename.png"
                Chart={LineChart}
                labelvals={[]}
                datavals={[]}
                datalabels={[]}
                setStart={(date) => {}}
                setRange={() => {}}
                queryLoading={false}
            />
       );

        const user = userEvent.setup();

        expect(useRefSpy).toBeCalled();
        expect(screen.getByTestId("range-select")).toBeVisible();

        await user.selectOptions(screen.getByRole("combobox"), ["30-day"]);
        expect(screen.getByDisplayValue("30-day")).toBeVisible();
    })

    it("should update range 7-day", async () => {
        const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: {
            href: "",
        } });

        render(
            <DownloadChart 
                title="Chart Title"
                filename="Filename.png"
                Chart={LineChart}
                labelvals={[]}
                datavals={[]}
                datalabels={[]}
                setStart={(date) => {}}
                setRange={() => {}}
                queryLoading={false}
            />
       );

        const user = userEvent.setup();

        expect(useRefSpy).toBeCalled();
        expect(screen.getByTestId("range-select")).toBeVisible();

        await user.selectOptions(screen.getByRole("combobox"), ["7-day"]);
        expect(screen.getByDisplayValue("7-day")).toBeVisible();
    })

})
