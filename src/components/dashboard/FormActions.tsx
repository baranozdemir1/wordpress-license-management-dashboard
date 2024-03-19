"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { VerticalDotsIcon } from "../icons/VerticalDotsIcon";
import { License } from "@/data/schema";
import { GenerateIcon } from "../icons/GenerateIcon";
import { CustomRadio } from "./LicenseAddButton";
import { deleteLicense, readLicense, updateLicense } from "@/app/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ILicense {
  license: License;
}

export const FormActions = ({ license }: ILicense) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isRemoverOpen,
    onOpen: onRemoverOpen,
    onOpenChange: onRemoverOpenChange,
  } = useDisclosure();
  const [domain, setDomain] = React.useState("");
  const [name, setName] = React.useState("");
  const [licenseKey, setLicenseKey] = React.useState("");
  const [status, setStatus] = React.useState("");

  const router = useRouter();

  const updateLicenseHandler = async () => {
    const { error } = await updateLicense(license.id, {
      domain,
      name,
      license_key: licenseKey,
      status,
    });

    if (!error) {
      toast.success("License updated successfully");
    } else {
      toast.error(error.message);
    }

    onOpenChange();
    router.refresh();
  };

  const removeLicenseHandler = async () => {
    const { error } = await deleteLicense(license.id);

    if (!error) {
      toast.success("License deleted successfully");
    } else {
      toast.error(error.message);
    }

    onRemoverOpenChange();
    router.refresh();
  };

  React.useEffect(() => {
    setLicenseKey(license.license_key);
    setDomain(license.domain);
    setName(license.name ? license.name : "");
    setStatus(license.status);
  }, [license]);

  const generateLicenseKey = () => {
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    setLicenseKey(randomString);
  };

  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <VerticalDotsIcon className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onPress={onOpen}>Edit</DropdownItem>
          <DropdownItem onPress={onRemoverOpen}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal id="updateModal" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update License
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
                  readOnly
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={generateLicenseKey}
                    >
                      <GenerateIcon className="text-xl text-default-400 pointer-events-none" />
                    </button>
                  }
                />

                <RadioGroup
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                  orientation="horizontal"
                  value={status}
                >
                  <CustomRadio value="active">Active</CustomRadio>
                  <CustomRadio value="paused">Paused</CustomRadio>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={updateLicenseHandler}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        id="removeLicense"
        isOpen={isRemoverOpen}
        onOpenChange={onRemoverOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you absolutely sure?
              </ModalHeader>
              <ModalBody>
                This action cannot be undone. This will permanently delete the
                item and remove the data from our servers.
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={removeLicenseHandler}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
