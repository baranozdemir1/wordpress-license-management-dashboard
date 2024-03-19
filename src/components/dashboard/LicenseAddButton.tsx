"use client";

import React from "react";
import { Button } from "@nextui-org/button";
import { PlusIcon } from "../icons/PlusIcon";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";

import { Input } from "@nextui-org/input";
import { RadioGroup, RadioProps, useRadio } from "@nextui-org/radio";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { GenerateIcon } from "../icons/GenerateIcon";
import toast from "react-hot-toast";
import { createLicense } from "@/app/actions";
import { useRouter } from "next/navigation";

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={
        "group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4 data-[selected=true]:border-primary"
      }
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
      </div>
    </Component>
  );
};

export default function LicenseAddButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [domain, setDomain] = React.useState("");
  const [name, setName] = React.useState("");
  const [licenseKey, setLicenseKey] = React.useState("");
  const [status, setStatus] = React.useState("");

  const router = useRouter();

  const addLicenseHandler = async () => {
    if (!domain) {
      toast.error("Domain is required");
      return;
    }
    if (!licenseKey) {
      toast.error("License Key is required");
      return;
    }
    if (!status) {
      toast.error("Status is required");
      return;
    }
    if (status !== "active" && status !== "paused") {
      toast.error("Status must be active or paused");
      return;
    }
    const data = {
      domain,
      name,
      license_key: licenseKey,
      status,
    };
    const { error, data: insertedData } = await createLicense(data);

    if (error) {
      toast.error(error.message);
      return;
    }

    onOpenChange();
    setDomain("");
    setName("");
    setLicenseKey("");
    setStatus("");
    toast.success("License added successfully");
    router.refresh();
  };

  const generateLicenseKey = () => {
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    setLicenseKey(randomString);
  };

  return (
    <>
      <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
        Add New
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New License
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Domain (required)"
                  variant="bordered"
                  onChange={(e) => setDomain(e.target.value)}
                  value={domain}
                  type="text"
                />
                <Input
                  label="Name (optional)"
                  variant="bordered"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                />
                <Input
                  label="License Key"
                  variant="bordered"
                  value={licenseKey}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={generateLicenseKey}
                    >
                      <GenerateIcon className="text-xl text-default-400 pointer-events-none" />
                    </button>
                  }
                  readOnly
                />

                <RadioGroup
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                  orientation="horizontal"
                >
                  <CustomRadio value="active">Active</CustomRadio>
                  <CustomRadio value="paused">Paused</CustomRadio>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={addLicenseHandler}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
